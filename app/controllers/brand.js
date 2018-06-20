'use strict';

const model = require('../models/brand');

module.exports = {

    validate: function(req, res, next){
        if(!req.errs) req.errs = [];

        if(!req.body.name || req.body.name === null || req.body.name === '') req.errs.push({
            field: 'name',
            detail: 'Brand name can not be null'
        });

        if(!req.body.description || req.body.description === null || req.body.description === '') req.errs.push({
            field: 'description',
            detail: 'Brand description can not be null'
        });

        if(!req.body.logo || req.body.logo === null || req.body.logo === '') req.errs.push({
            field: 'logo',
            detail: 'Brand logo can not be null'
        });

        next();
    },

    insertOne: function (req, res, next) {
        if(req.errs && req.errs.length !== 0) {
            console.log(req.errs);
            return;
        }

        let brand = new model(req.body);
        brand.save(function (err, result) {
            if(err) {
                console.log(err);
                res.send(err);
                return;
            }
            res.render('index', {
                title: 'Success',
                detail: 'Add brand successfully'
            })
        })
    },

    productView: function (req, res, next) {
        let length = req.brands.length;
        res.locals.path = '/products-manager/brands';
        if (length === 0) {
            res.render('admin/pages/products-manager/brands', {
                type: 0,
            });
        }
        else if (!req.meta) {
            res.render('admin/pages/products-manager/brands', {
                type: 1,
                brands: req.brands,
            });
        }
        else {
            res.render('admin/pages/products-manager/brands', {
                type: 2,
                brands: req.brands,
                meta: req.meta
            });
        }
    },

    getOne: function (req, res, next) {
        let query = {
            id: req.params.id
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            req.brands = result;
            next();
        });
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
                req.brands = [];
                next();
                return;
            }
            req.brands = result[0].data;
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
}