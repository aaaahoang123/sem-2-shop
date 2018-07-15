'use strict';

const model = require('../models/category');
const mongoose = require('mongoose');

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
        req.query.limit = "0";
        next();
    },

    setParentLevel: function (req, res, next) {
        if (!req.query.level) {
            req.query.level = '0';
        }
        else {
            req.query.level = String(Math.abs(Number(req.query.level)) - 1);
        }
        next();
    },

    getList: function (req, res, next) {
        // if(!req.query.level || Number(req.query.level) === 1) next();
        let limit = 10, skip = 0, page = 1, level = 1;
        if (req.query.climit && /^\d+$/.test(req.query.climit)) limit = Math.abs(Number(req.query.climit));
        if (req.query.cpage && !['-1', '1'].includes(req.query.cpage) && /^\d+$/.test(req.query.cpage)) {
            page = Math.abs(Number(req.query.cpage));
            skip = (page - 1) * limit;
        }
        if (req.query.clevel && /^\d+$/.test(req.query.clevel)) level = Math.abs(Number(req.query.clevel));
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
        if (req.query.cq) {
            let pattern = new RegExp(req.query.cq, 'i');
            query[0].$match.$or = [
                {description: pattern},
                {name: pattern}
            ];
        }
        if (req.query.limit === "0") {
            query[query.length-1].$facet.data = [{$skip: skip}];
        }
        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = res.locals.message;
                return next();
            }
            res.locals.level = level;
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.products = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                res.locals.categories = [];
                return next();
            }
            res.locals.categories = result[0].data;
            let totalItems = result[0].meta[0].totalItems;

            res.locals.cmeta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: limit,
                offset: skip,
                page: page,
                q: req.query.cq
            };
            next();
        });
    },

    getMultiCategories: (req, res, next) => {
        let arr = [];
        req.body.categories.forEach(c => {
            arr.push(mongoose.Types.ObjectId(c));
        });
        console.log(arr);
        console.log("1");
        let pipeline = [
            {
                $match: {
                    _id: {$in: arr}
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "children",
                    as: "parent"
                }
            },
            {
                $unwind: {
                    path: "$parent",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "parent._id",
                    foreignField: "children",
                    as: "parent.parent"
                }
            },
            {
                $group: {
                    _id: '$_id',
                    parent: {
                        '$push': '$parent'
                    }
                }
            }
        ];
        // console.log(pipeline);
        model.aggregate(pipeline, (err, result) => {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = res.locals.message;
                return next();
            }
            res.locals.categories = result;
            next();
        })
    },

    insertOne: function (req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            next();
            return;
        }
        let newCategory = new model(req.body);
        newCategory.save(function (err, result) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                console.log(err);
                if (err.code === 11000) res.locals.errs.name = "This category name has already existed";
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
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
        let name = '';
        if (req.params.name) name = req.params.name;
        if (req.query.category) name = req.query.category;
        if (name === '') return next();
        let query = [
            {
                $match: {
                    status: 1,
                    name: name
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
            }
        ];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            if (result.length !== 0) res.locals.category = result[0];
            next();
        });
    },

    editOne: function(req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            next();
            return;
        }

        let category = req.body;
        category.updated_at = Date.now();
        model.findOneAndUpdate({name: req.params.name}, {$set: category}, {new: true}, function (err, result) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) res.locals.errs.name = "This category name has already existed";
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Edit category successfully',
                link: '/manager/dashboard/products-manager/categories',
                result: result
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
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            res.locals.categories = result;
            next();
        });
    },

    updateParent: function (req, res, next) {
        if ((res.locals.errs && Object.keys(res.locals.errs).length !== 0) || Number(req.body.level) === 1) return next();
        let setter = {$set: {updated_at: Date.now()}};
        let query;
        // xóa children sau khi delete
        if (req.editParentAction === 'pull') {
            query = {children: res.locals.result._id};
            setter.$pull = {children: res.locals.result._id};
        }
        // đẩy children sau khi thêm mới
        else {
            query = {_id: req.body.parent};
            setter.$push = {children: res.locals.result._id};
        }
        model.findOneAndUpdate(query, setter, {new: true}, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
            }
            next();
        });
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
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            if (result === null) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs["404"] = 'Category not found';
                return next();
            }
            req.body = result;
            req.editParentAction = 'pull';
            res.locals = {
                title: 'Success',
                detail: 'Delete category successfully',
                link: '/manager/dashboard/products-manager/categories',
                result: result
            };
            next();
        });
    },

    responseJson: function (req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json(res.locals.errs);
            return;
        }
        res.status(200);
        res.json(res.locals.result);
    },

    responseUpdateByEditFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/products-manager/categories-form', {
                method: 'PUT',
                title: 'EDIT CATEGORY',
                path: '/products-manager/categories',
                action: '/manager/dashboard/products-manager/categories/' + req.params.name + '?_method=PUT',
                level: req.body.level,
                category: req.body
            });
            return;
        }
        res.render('index');
    },

    responseCategoryEditFormView: function (req, res) {
        res.render('admin/pages/products-manager/categories-form', {
            method: 'PUT',
            title: 'EDIT CATEGORY',
            path: '/products-manager/categories',
            action: '/manager/dashboard/products-manager/categories/' + req.params.name + '?_method=PUT',
            level: res.locals.category?res.locals.category.level:undefined
        })
    },

    responseInsertOneByFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/products-manager/categories-form', {
                title: 'ADD CATEGORY',
                path: '/products-manager/categories/create',
                parentLevel: Math.abs(Number(req.query.level)),
                level:  Math.abs(Number(req.query.level)) + 1,
                category: req.body
            });
            return;
        }
        res.render('index')
    },

    findAll: function (req, res, next) {
        let query = [
            {
                "$match": {"level": 1, "status": 1}
            },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "children",
                    "foreignField": "_id",
                    "as": "childrenObj"
                }
            },
            {
                "$unwind": {
                    "path": "$childrenObj",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "childrenObj.children",
                    "foreignField": "_id",
                    "as": "childrenObj.childrenObj"
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "level": {"$first": "$level"},
                    "name": {"$first": "$name"},
                    "description": {"$first": "$description"},
                    "created_at": {"$first": "$created_at"},
                    "updated_at": {"$first": "$updated_at"},
                    "status": {"$first": "$status"},
                    "children": {"$first": "$children"},
                    "childrenObj": {"$push": "$childrenObj"}
                }
            }
        ];
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            if (result.length === 0) {
                res.locals.categories = [];
                next();
                return;
            }
            res.locals.categories = result;
            next();
        })
    },

    responseFormView: function (req, res) {
        res.locals.title = 'ADD CATEGORY';
        res.locals.path = '/products-manager/categories/create';
        res.locals.parentLevel = Math.abs(Number(req.query.level));
        res.locals.level = res.locals.parentLevel + 1;
        res.render('admin/pages/products-manager/categories-form');
    },

    responseCategoryView: function (req, res) {
        res.render('admin/pages/products-manager/categories', {
            path: '/products-manager/categories'
        });
    }
};