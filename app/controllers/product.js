'use strict';

const model = require('../models/product');
//const Set = require('collections/set');

module.exports = {
    validate: function (req, res, next) {
        if (!res.locals.errs) res.locals.errs = {};

        if (!req.body.name || req.body.name === null || req.body.name === "") res.locals.errs.name = "Product Name cant not null";

        if (!req.body.code || req.body.code === null || req.body.code === "") res.locals.errs.code = "Product Code cant not null";

        if (!req.body.description || req.body.description === null || req.body.description === "") res.locals.errs.description = "Product Description cant not null";

        if (!req.body.categories || req.body.categories === null || req.body.categories === "" || req.body.categories.length === 0) res.locals.errs.categories = "Product Categories cant not null";

        if (!req.body.brand || req.body.brand === null || req.body.brand === "") res.locals.errs.brand = "Product Brand cant not null";

        if (!req.body.price || req.body.price === null || req.body.price === "") res.locals.errs.price = "Product Price cant not null";

        if (!req.body.images || req.body.images === null || req.body.images === "") res.locals.errs.images = "Product Images cant not null";

        if (Object.keys(res.locals.errs).length !== 0) {
            res.locals.errStatus = 400;
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
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            next();
            return;
        }
        let newProduct = new model(req.body);
        newProduct.save(function (err, result) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) {
                    res.locals.errStatus = 409;
                    res.locals.errs.name = "This product code has already existed";
                }
                res.locals.errs.database = err.message;
                next();
                return;
            }
            res.locals.successResponse = {
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
        let query = {
            code: req.params.code
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if (result.length!==0) res.locals.product = result[0];
            next();
        });
    },

    productView: function (req, res, next) {
        let length = res.locals.products.length;
        res.locals.path = '/products-manager/products';
        if (length === 0) {
            res.render('admin/pages/products-manager/products', {
                type: 0
            });
        }
        else if (!req.meta) {
            res.render('admin/pages/products-manager/products', {
                type: 1
            });
        }
        else {
            res.render('admin/pages/products-manager/products', {
                type: 2
            });
        }
    },

    getList: function (req, res, next) {
        let limit = 10, skip = 0, page = 1;
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
        if (req.query.q) {
            let pattern = new RegExp(req.query.q, 'i');
            query[0].$match.$or = [
                {code: pattern},
                {description: pattern},
                {name: pattern}
            ];
        }
        if (req.query.noneLimitProduct) query[query.length-1].$facet.data.length = 1;

        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.products = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                res.locals.products = [];
                next();
                return;
            }
            res.locals.products = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            res.locals.meta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: !req.lp?limit:'none',
                offset: skip,
                page: page,
                q: req.query.q
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
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000){
                    res.locals.errStatus = 409;
                    res.locals.errs.name = "This Product code has already existed";
                }
                res.locals.errs.database = err.message;
                res.locals.product = req.body;
                next();
                return;
            }
            res.locals.successResponse = {
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
                if (!req.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            if(result === null) {
                if (!req.errs) res.locals.errs = {};
                res.locals.errStatus = 404;
                res.locals.errs["404"] = 'Product not found';
                next();
                return;
            }
            res.locals.successResponse = {
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
        if(res.locals.errs && Object.keys(res.locals.errs).length !== 0){
            res.status(res.locals.errStatus);
            if (res.locals.errStatus === 400) {
                res.send({
                    code: 400,
                    message: "Product code, name, description, brand, images, category not null"
                });
            } else if (res.locals.errStatus === 409) {
                res.send({
                    code: 409,
                    message: res.locals.errs.name
                })
            }else if(res.locals.errStatus === 404){
                res.send({
                    code: 404,
                    message: res.locals.errs["404"]
                })
            }
            return;
        }
        res.status(res.locals.successResponse.status);
        res.send(res.locals.successResponse.result);
    },

    responseEditFormView: function(req, res, next){
        res.render('admin/pages/products-manager/products-form', {
            path: '/products-manager/products',
            title: 'EDIT PRODUCTS',
            link: '/manager/dashboard/products-manager/products',
            extraJs: '/admin/js/pages/products-manager/edit-product.js',
            editBtnSubmit: 'edit-btn-submit'
        });
    },

    responseProductFormView: function (req, res, next) {
        if((!res.locals.errs || Object.keys(res.locals.errs).length === 0) && (!res.locals.successResponse || Object.keys(res.locals.successResponse).length === 0)){
            res.render('admin/pages/products-manager/products-form', {
                path: '/products-manager/add-product',
                title: 'ADD PRODUCT',
            });
        }
    }
};


