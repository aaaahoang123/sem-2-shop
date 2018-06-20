'use strict';

const model = require('../models/product');

module.exports = {
    checkNull: function (req,res,next) {
        var data = req.body;
        console.log(req.body);
        console.log(data.specifications);
        if (!data.code || !data.name || !data.description || !data.categories || !data.brand || !data.price) {
            res.status(403);
            res.send({
                'status': '403',
                'message': 'Product code,  name, description, categories, brand, price can\'t be null or undefined'
            });
            return;
        }
        next();
    },

    checkUnique: function(req, res, next) {
        if(req.products.length !== 0 ){
            res.status(409);
            res.send({
                'status': '409',
                'message': 'Product code is unique'
            });
            return;
        }
        next();
    },

    setCodeFromBody: function(req, res, next){
        if (!req.params) req.params = {};
        req.params.code = req.body.code;
        next();
    },

    insertOne: function (req, res, next) {
        var newProduct = new model(req.body);
        newProduct.save(function (err, result) {
            if(err){
                res.status(400);
                res.send({
                    code : 400,
                    title: 'Server Error',
                    detail: 'Server Error'
                });
                console.log(err);
                return;
            }
            res.status(201);
            res.send(result);
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
            skip = (page - 1) * limit - 1;
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
    }
};


