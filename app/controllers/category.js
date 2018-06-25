'use strict';

const model = require('../models/category');
module.exports = {

    validate: function (req, res, next) {
        if (!req.errs) req.errs = {};
        if (!req.body.name || req.body.name === null || req.body.name === "") req.errs.name = "Category Name can not null";
        if (!req.body.description || req.body.description === null || req.body.description === "") req.errs.description = "Category Description can not null";
        if (!req.body.level || req.body.level === null || req.body.level === "") req.errs.level = "Category level can not null";
        else if (Number(req.body.level) !== 1 && (req.body.parent === null || req.body.parent === '' || !req.body.parent)) req.errs.parent = "Category parent can not null when level is 2 or 3";
        next();
    },

    setLimitO: function (req, res, next) {
        if (req.query.limit === "0") {
            query[query.length].$facet.data = [{$skip: skip}];
        }
        next();
    },

    setParentLevel: function (req, res, next) {
        if (req.query.level === 1 || !req.query.level) {
            req.query.level = 0;
        }
        else {
            req.query.level -= 1;
        }
        next();
    },

    getList: function (req, res, next) {
        console.log("level " + req.query.level);
        // if(!req.query.level || Number(req.query.level) === 1) next();
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
                "$lookup": {
                    "from": "categories",
                    "localField": "_id",
                    "foreignField": "children",
                    "as": "parent"
                }
            },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "children",
                    "foreignField": "_id",
                    "as": "children"
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

    insertOne: function (req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }
        let newCategory = new model(req.body);
        newCategory.save(function (err, result) {
            if (err) {
                if (!req.errs) req.errs = {};
                console.log(err);
                if (err.code === 11000) req.errs.name = "This category name has already existed";
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Add category successfully',
                link: '/manager/dashboard/products-manager/categories/create',
                result: result,
                status: 201
            };
            next();
        });
    },

    getOne: function (req, res, next) {
        let query = [
            {
                $match: {
                    status: 1,
                    name: req.params.name
                }
            },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "_id",
                    "foreignField": "children",
                    "as": "parent"
                }
            },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "children",
                    "foreignField": "_id",
                    "as": "children"
                }
            }];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.category = result[0];
            next();
        });
    },

    editOne: function(req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }

        let category = req.body;
        category.updated_at = Date.now();
        model.findOneAndUpdate({name: req.params.name}, {$set: category}, {new: true}, function (err, result) {

            if (err) {
                if (!req.errs) req.errs = {};
                if (err.code === 11000) req.errs.name = "This category name has already existed";
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Edit category successfully',
                link: '/manager/dashboard/products-manager/categories',
                added: result
            };
            next();
        });
    },

    getListGroup: function (req, res, next) {
        let query = [
            {
                $match: {
                    status: 1
                }
            },
            {
                $group: {
                    _id: "$level",
                    categories_group: {$push: "$$ROOT"}
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
            req.categories = result;
            next();
        });
    },

    updateParent: function (req, res, next) {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }
        if (req.successResponse) {
            let query = {
                _id: req.body.parent
            };
            model.findOneAndUpdate(query, {
                $push: {children: req.successResponse.result._id},
                $set: {updated_at: Date.now()}
            }, {new: true}, function (err, result) {
                if (err) {
                    console.log(err);
                    if (!req.errs) req.errs = {};
                    req.errs.database = err.message;
                    next();
                    return;
                }
                next();
            });
        }
    },

    deleteOne: function (req, res, next) {
        let query = {
            name: req.params.name
        };
        model.findOneAndUpdate(query, {
            $set: {
                status: -1,
                updated_at: Date.now()
            }
        }, {new: true}, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if (result === null) {
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
        if (req.errs && Object.keys(req.errs).length !== 0) {
            res.status(404);
            res.json(req.errs);
            return;
        }
        res.status(200);
        res.json(req.successResponse.result);
    },

    responseCategoryEditFormView: function (req, res, next) {
        if (!res.locals) res.locals = {};
        res.locals.method = 'PUT';
        res.locals.title = 'EDIT CATEGORY';
        res.locals.path = '/products-manager/categories';
        res.locals.action = '/manager/dashboard/products-manager/categories/' + req.params.name + '?_method=PUT';
        if (req.category && req.category.length !== 0) {
            res.render('admin/pages/products-manager/categories-form', {
                category: req.category,
                level: req.category.level
            });
        }
        else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/products-manager/categories-form', {
                errs: req.errs,
                category: req.body,
            });
        }
        else if (req.successResponse && Object.keys(req.successResponse).length !== 0) {
            res.render('index', req.successResponse);
        }
        else {
            res.render('admin/pages/products-manager/categories-form', {
                category: undefined,
                link: '/manager/dashboard/products-manager/categories',
            });
        }
    },

    responseFormView: function (req, res, next) {
        let lv = 0;
        let title = 'ADD CATEGORY';
        if (req.successResponse) {
            res.render('index', req.successResponse);
            return;
        }
        else if (req.categories && req.categories.length !== 0) {
            lv = req.query.level ? req.query.level : 0;
            console.log(lv);
            res.render('admin/pages/products-manager/categories-form', {
                path: '/products-manager/categories/create',
                listParent: req.categories,
                level: lv,
                category: req.body,
                title: title
            });
        } else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/products-manager/categories-form', {
                path: '/products-manager/categories/create',
                level: req.body.level - 1,
                errs: req.errs,
                category: req.body,
                title: title
            });
            console.log(req.body);
        }
        else {
            res.render('admin/pages/products-manager/categories-form', {
                path: '/products-manager/categories/create',
                level: lv,
                title: title
            });
        }
    },

    responseCategoryView: function (req, res, next) {
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