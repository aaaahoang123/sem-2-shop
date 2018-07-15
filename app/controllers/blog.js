'use strict';

const model = require('../models/blogs');

module.exports = {
    validate: function (req, res, next) {
        if(!res.locals.errs) res.locals.errs = {};
        if(!req.body.title || req.body.title === null || req.body.title === '') res.locals.errs.title = 'Title cannot be null';
        if(!req.body.content || req.body.content === null || req.body.content === '') res.locals.errs.content = "Content cannot be null";
        next();
    },

    insertOne: function (req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();
        req.body.uri_title = req.body.title.replace(/\s/g, '-');
        let blog = new model(req.body);
        blog.save(function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) res.locals.errs.title = "This blog title has already existed";
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Add blog successfully',
                link: '/manager/web-config/blogs/create',
                result: result
            };
            next();
        });
    },

    getOne: function (req, res, next) {
        let query = {
            uri_title: req.params.uri_title
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            if (result.length !== 0) {
                res.locals.blog = result[0];
                console.log(res.locals.blog);
            }
            next();
        });
    },

    setLimit: function(req, res, next) {
        req.query.limit = '9';
        next();
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
            query[0].$match.$or = [
                {content: pattern},
                {uri_title: pattern}
            ];
        }

        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt res.locals.brands = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                res.locals.blogs = [];
                return next();
            }
            res.locals.blogs = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            res.locals.meta = {
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

    editOne: function(req, res, next) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();
        req.body.uri_title = req.body.title.replace(/\s/g, '-');
        let blog = req.body;
        blog.updated_at = Date.now();
        model.findOneAndUpdate({uri_title: req.params.uri_title}, {$set: blog}, {new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) res.locals.errs.name = "This blog title has already existed";
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Edit blog successfully',
                link: '/manager/web-config/blogs',
                result: result
            };
            next();
        });
    },

    deleteOne: function (req, res, next) {
        let query = {
            uri_title: req.params.uri_title
        };
        model.findOneAndUpdate(query, {$set: {status: -1, updated_at: Date.now()}}, {new: true}, function (err, result) {
            if(err){
                console.log(err);
                if (!res.locals.errs) req.res.locals = {};
                res.locals.errs.database = res.locals.message;
                return next();
            }
            if(result === null) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs["404"] = 'Blog not found';
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Delete blog successfully',
                link: '/manager/web-config/blogs',
                result: result
            };
            next();
        });
    },

    responseJson: function (req, res) {
        if(res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json(res.locals.errs);
            return;
        }
        res.status(200);
        res.json(res.locals.result);
    },

    responseInsertOneByBlogFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/web-config/blogs-form', {
                path: '/web-config/add-blog',
                blog: req.body,
                title: 'ADD BLOG'
            });
        } else {
            res.render('index');
        }
    },

    responseBlogEditForm: (req, res) => {
        res.render('admin/pages/web-config/blogs-form', {
            path: '/web-config/blogs',
            method: 'PUT',
            title: 'EDIT BLOG'
        });
    },

    responseEditByBlogForm: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/web-config/blogs-form', {
                title: 'EDIT BLOG',
                blog: req.body,
                path: '/web-config/blogs',
                method: 'PUT'
            });
            return;
        }
        res.render('index');
    },

    responseBrandTable: (req, res) => res.render('admin/pages/web-config/blogs', {path: '/web-config/blogs'})
};