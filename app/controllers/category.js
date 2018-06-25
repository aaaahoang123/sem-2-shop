'use strict';

const model = require('../models/category');

module.exports = {
    getList: function (req, res, next) {
        let limit = 10, skip = 0, page = 1, level = 1;
        if (req.query.limit && /^\d+$/.test(req.query.limit)) limit = Math.abs(Number(req.query.limit));
        if (req.query.page && !['-1', '1'].includes(req.query.page) && /^\d+$/.test(req.query.page)) {
            page = Math.abs(Number(req.query.page));
            skip = (page - 1) * limit;
        }
        if (req.query.level && /^\d+$/.test(req.query.level)) level = Math.abs(Number(req.query.level));
        let query = [
            {
                $match: {
                    status: 1,
                    level: level
                }
            },
            {
                "$lookup" : {
                    "from" : "categories",
                    "localField" : "_id",
                    "foreignField" : "children",
                    "as" : "parent"
                }
            },
            {
                "$lookup" : {
                    "from" : "categories",
                    "localField" : "children",
                    "foreignField" : "_id",
                    "as" : "children"
                }
            },
            {
                $facet: {
                    meta: [{$count: "totalItems"}],
                    data: [{$skip: skip}, {$limit: limit}]
                }
            }
        ];
        if (req.query.q) {
            let pattern = new RegExp(req.query.q, 'i');
            query[0].$match.$or = [
                {description: pattern},
                {name: pattern}
            ];
        }
        if (req.query.limit === "0") {
            query[query.length].$facet.data = [{$skip: skip}];
        }
        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.level = level;
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.products = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                req.categories = [];
                next();
                return;
            }
            req.categories = result[0].data;
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

    getListGroup: function(req,res,next){
        let query = [
            {
                $match: {
                    status: 1
                }
            },
            {
                $group : {
                    _id : "$level",
                    categories_group: { $push: "$$ROOT" }
                }
            }
        ];

        model.aggregate(query, function (err, result) {
            if(err){
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.categories = result;
            next();
        });
    },

    deleteOne: function (req, res, next) {
        let query = {
            name: req.params.name
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
                req.errs["404"] = 'Category not found';
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Delete category successfully',
                link: '/manager/dashboard/products-manager/categoriess',
                result: result
            };
            next();
        });
    },

    responseJson: function (req, res, next) {
        if(req.errs && Object.keys(req.errs).length !== 0) {
            res.status(404);
            res.json(req.errs);
            return;
        }
        res.status(200);
        res.json(req.successResponse.result);
    },
    
    responseCategoryView: function (req, res, next) {
        // res.render('admin/pages/products-manager/categories', {path: '/products-manager/categories'});
        let length = req.categories.length;
        res.locals.path = '/products-manager/categories';
        console.log(req.level);
        if (length === 0) {
            res.render('admin/pages/products-manager/categories', {
                type: 0,
                link: '/manager/dashboard',
                level: req.level,
                meta: {q: req.query.q}
            });
        }
        else if (!req.meta) {
            res.render('admin/pages/products-manager/categories', {
                type: 1,
                categories: req.categories,
                level: req.level
            });
        }
        else {
            res.render('admin/pages/products-manager/categories', {
                type: 2,
                categories: req.categories,
                level: req.level,
                meta: req.meta
            });
        }
    }
};