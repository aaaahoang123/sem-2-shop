'use strict';

const model = require('../models/product');
//const Set = require('collections/set');
const mongoose = require('mongoose');

module.exports = {
    validate: function (req, res, next) {
        if (!req.errs) req.errs = {};

        if (!req.body.name || req.body.name === null || req.body.name === "") req.errs.name = "Product Name cant not null";

        if (!req.body.code || req.body.code === null || req.body.code === "") req.errs.code = "Product Code cant not null";

        if (!req.body.description || req.body.description === null || req.body.description === "") req.errs.description = "Product Description cant not null";

        if (!req.body.categories || req.body.categories === null || req.body.categories === "" || req.body.categories.length === 0) req.errs.categories = "Product Categories cant not null";

        if (!req.body.brand || req.body.brand === null || req.body.brand === "") req.errs.brand = "Product Brand cant not null";

        if (!req.body.price || req.body.price === null || req.body.price === "") req.errs.price = "Product Price cant not null";

        if (!req.body.images || req.body.images === null || req.body.images === "") req.errs.images = "Product Images cant not null";

        if (Object.keys(req.errs).length !== 0) {
            req.errStatus = 400;
        }
        next();
    },

    filterCategoriesSet: (req, res, next) => {
        let set = new Set();
        res.locals.categories.forEach(cate => {
            set.add(String(cate._id));
            cate.parent.forEach(p => {
                set.add(String(p._id));
                p.parent.forEach(gp => {
                    set.add(String(gp._id))
                })
            })
        });
        set.delete('undefined');
        req.body.categories = [...set];
        next();
    },

    insertOne: function (req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }
        let newProduct = new model(req.body);
        newProduct.save(function (err, result) {
            if (err) {
                if (!req.errs) req.errs = {};
                if (err.code === 11000) {
                    req.errStatus = 409;
                    req.errs.name = "This product code has already existed";
                }
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Add Product successfully',
                link: '/manager/dashboard/products-manager/add-brand',
                result: result,
                status: 201
            };
            next();
        })
    },

    getOne: function (req, res, next) {
        let query = [
            {
                $match: {
                    status: 1,
                    code: req.params.code
                }
            },
            {
                "$lookup" : {
                    "from" : "categories",
                    "localField" : "categories",
                    "foreignField" : "_id",
                    "as" : "categories"
                }
            },
            {
                "$lookup" : {
                    "from" : "brands",
                    "localField" : "brand",
                    "foreignField" : "_id",
                    "as" : "brand"
                }
            }
        ];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.products = result;
            next();
        });
    },

    productView: function (req, res, next) {
        let length = req.products.length;
        res.locals.path = '/products-manager/products';
        if (length === 0) {
            res.render('admin/pages/products-manager/products', {
                type: 0,
            });
        }
        else if (!req.meta) {
            res.render('admin/pages/products-manager/products', {
                type: 1,
                products: req.products,
            });
        }
        else {
            res.render('admin/pages/products-manager/products', {
                type: 2,
                products: req.products,
                meta: req.meta
            });
        }
    },

    getList: function (req, res, next) {
        let limit = 10, skip = 0, page = 1, min = 0, max = res.locals.maxPrice, sort = '';
        if (req.query.limit && /^\d+$/.test(req.query.limit)) limit = Math.abs(Number(req.query.limit));
        if (req.query.page && !['-1', '1'].includes(req.query.page) && /^\d+$/.test(req.query.page)) {
            page = Math.abs(Number(req.query.page));
            skip = (page - 1) * limit;
        }
        /**
         * Sử dụng mongodb aggregate, $facet
         * Cấu trúc result trả về, bao gồm 2 trường meta và data, meta là thông số phân trang, data là dữ liệu lấy được
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/facet/
         */
        let query = [
            {
                $match: {
                    status: 1,
                }
            },
            {
                "$lookup" : {
                    "from" : "categories",
                    "localField" : "categories",
                    "foreignField" : "_id",
                    "as" : "categories"
                }
            },
            {
                "$lookup" : {
                    "from" : "brands",
                    "localField" : "brand",
                    "foreignField" : "_id",
                    "as" : "brand"
                }
            },
            {
                '$facet': {
                    meta: [{$count: "totalItems"}],
                    data: [{$skip: skip}, {$limit: limit}] // add projection here wish you re-shape the docs
                }
            }
            ];

        /**
         * Nếu có tìm kiếm, tạo match và đẩy vào đầu array query
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/match/
         */
        var q;
        if (req.query.q) {
            let pattern = new RegExp(req.query.q, 'i');
            q = [
                {code: pattern},
                {description: pattern},
                {name: pattern}
            ];
        }
        if (res.locals.category || res.locals.brand || req.query.min || req.query.max || req.query.sort) {
            query[0].$match.$and = [];
            if (q) query[0].$match.$and.push({$or: q});
            if (res.locals.category) query[0].$match.$and.push({categories: res.locals.category._id});
            if (res.locals.brand) query[0].$match.$and.push({brand: res.locals.brand._id});
            if (req.query.min) {
                min=Number(req.query.min);
                query[0].$match.$and.push({price: {$gt: min-1}});
            }
            if (req.query.max) {
                max=Number(req.query.max);
                query[0].$match.$and.push({price: {$lt: max+1}});
            }
            if (req.query.sort) {
                sort = req.query.sort;
                let sortArr = req.query.sort.split('_');
                let sortObj = {$sort: {}};
                sortObj.$sort[sortArr[0]] = Number(sortArr[1]);

                query.splice(1,0,sortObj)
            }
        }
        else if(q) query[0].$match.$or = q;
        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.products = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                req.products = [];
                next();
                return;
            }
            if (sort !== '') res.locals.sort = sort;
            req.products = result[0].data;
            req.total = result[0].meta[0].totalItems;
            req.meta = {
                totalItems: req.total,
                total: Math.ceil(req.total / limit),
                limit: limit,
                offset: skip,
                page: page,
                q: req.query.q,
                min: min,
                max: max,
            };
            next();
        });
    },

    editOne: function(req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }

        let product = req.body;
        product.updated_at = Date.now();
        model.findOneAndUpdate({code: req.params.code}, {$set: product}, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                if (err.code === 11000){
                    req.errStatus = 409;
                    req.errs.name = "This Product code has already existed";
                }
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Edit product successfully',
                link: '/manager/dashboard/products-manager/products',
                result: result,
                status: 200
            };
            next();
        });
    },

    deleteOne: function (req, res, next) {
        let query = {
            code: req.params.code
        };
        model.findOneAndUpdate(query, {$set: {status: -1, updated_at: Date.now()}}, {new: true}, function (err, result) {
            if(err){
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if(result === null) {
                if (!req.errs) req.errs = {};
                req.errStatus = 404;
                req.errs["404"] = 'Product not found';
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Delete product successfully',
                link: '/manager/dashboard/products-manager/product',
                status: 200,
                result: result
            };
            next();
        });
    },

    responseProductJson:  function (req, res, next) {
        if(req.errs && Object.keys(req.errs).length !== 0){
            res.status(req.errStatus);
            if (req.errStatus === 400) {
                res.send({
                    code: 400,
                    message: "Product code, name, description, brand, images, category not null"
                });
            } else if (req.errStatus === 409) {
                res.send({
                    code: 409,
                    message: req.errs.name
                })
            }else if(req.errStatus === 404){
                res.send({
                    code: 404,
                    message: req.errs["404"]
                })
            }
            return;
        }
        res.status(req.successResponse.status);
        res.send(req.successResponse.result);

    },

    responseEditFormView: function(req, res, next){
        res.render('admin/pages/products-manager/products-form', {
            path: '/products-manager/products',
            products: (req.products && req.products.length !== 0)?req.products[0]:undefined,
            categories: (req.categories && req.categories.length !== 0)?req.categories:[],
            title: 'EDIT PRODUCTS',
            link: '/manager/dashboard/products-manager/products',
            extraJs: '/admin/js/pages/products-manager/edit-product.js',
            editBtnSubmit: 'edit-btn-submit'
        });
    },

    responseProductFormView: function (req, res, next) {
        if((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)){
            res.render('admin/pages/products-manager/products-form', {
                path: '/products-manager/add-product',
                title: 'ADD PRODUCT',
                categories: (req.categories && req.categories.length !== 0)?req.categories:[]
            });
        }
    },

    getMaxPrice: function (req, res, next) {
        let query = [
            {
                $match: {
                    status: 1
                }
            },
            {
                $group: {
                    _id: null,
                    maxPrice: {$max: "$price"}
                }
            }
        ];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            res.locals.maxPrice = result[0].maxPrice;
            next();
        })
    },

    recentlyViewed: function (req, res, next) {
        console.log(JSON.parse(req.cookies.code)); //cho nay dang la code treen server, thang server no doc cookie dc gui len tu trinh duyet
        // server co the set nguoc cookie ve client sau khi xu ly.
        var codes = JSON.parse(req.cookies.code);
        var query = [
            {
                $match: {
                    status: 1,
                    code: {$in: codes}
                }
            }
        ];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            console.log(result);
            res.locals.rvProducts = result;
            next();
        });
    }
};


