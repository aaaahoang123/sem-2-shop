'use strict';

const model = require('../models/product');

module.exports = {
    validate: function (req,res,next) {
        console.log(req.body);
        if(!req.errs) req.errs = {};

        if(!req.body.name || req.body.name === null || req.body.name === "") req.errs.name = "Product Name cant not null";

        if(!req.body.code || req.body.code === null || req.body.code === "") req.errs.code = "Product Code cant not null";

        if(!req.body.description || req.body.description === null || req.body.description === "") req.errs.description = "Product Description cant not null";

        if(!req.body.categories || req.body.categories === null || req.body.categories === "") req.errs.categories = "Product Categories cant not null";

        if(!req.body.brand || req.body.brand === null || req.body.brand === "") req.errs.brand = "Product Brand cant not null";

        if(!req.body.price || req.body.price === null || req.body.price === "") req.errs.price = "Product Price cant not null";

        if(!req.body.images || req.body.images === null || req.body.images === "") req.errs.images = "Product Images cant not null";

        if(Object.keys(req.errs).length !== 0){
            req.errStatus = 400;
        }
        next();
    },

    insertOne: function (req, res, next) {
        if(req.errs && Object.keys(req.errs).length !== 0){
            next();
            return;
        }
        var newProduct = new model(req.body);
        newProduct.save(function (err, result) {
            if(err){
                if(!req.errs) req.errs = {};
                if(err.code === 11000){
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
        let query = {
            code: req.params.code
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            req.products = result;
            console.log( req.products);
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
        let query = [{
            '$facet': {
                meta: [{$count: "totalItems"}],
                data: [{$skip: skip}, {$limit: limit}] // add projection here wish you re-shape the docs
            }
        }];

        /**
         * Nếu có tìm kiếm, tạo match và đẩy vào đầu array query
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/match/
         */
        if (req.query.q) {
            let pattern = new RegExp(req.query.q, 'i');
            query.unshift({
                $match: {
                    $or: [
                        {code: pattern},
                        {description: pattern},
                        {name: pattern}
                    ]
                }
            });
        }

        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.products = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                req.products = [];
                next();
                return;
            }
            req.products = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            req.meta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: limit,
                offset: skip,
                page: page,
                q: req.query.q
            };
            next();
        });
    },

    responseProductJson:  function (req, res, next) {
        if(req.errs && Object.keys(req.errs).length !== 0){
            res.status(req.errStatus);
            if(req.errStatus === 400){
                res.send({
                    code: 400,
                    message: "Product code, name, description, brand, images, category not null"
                });
            }else if(req.errStatus === 409){
                res.send({
                    code: 409,
                    message: req.errs.name
                })
            }
            return;
        }
        res.status(req.successResponse.status);
        res.send(req.successResponse.result);

    },

    responseProductFormView: function (req, res, next) {
        if((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)){
            res.render('admin/pages/products-manager/products-form', {path: '/products-manager/add-product'});
        }
    }
};


