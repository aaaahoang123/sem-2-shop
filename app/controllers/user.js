'use strict';

const model = require('../models/user');

module.exports = {

    validate: (req, res, next) => {
        if(!req.errs) req.errs = {};

        if(!req.body.full_name || req.body.full_name === null || req.body.full_name === '') req.errs.full_name = 'Full name is required';

        if(!req.body.gender || req.body.gender === null || req.body.gender === '') req.errs.gender = 'Gender is required';

        if (req.body.birthday && req.body.birthday !== '' && new Date(req.body.birthday) > Date.now()) req.errs.birthday = 'Your birthday must be sooner than today!';

        if(!req.body.address || req.body.address === null || req.body.address === '') req.errs.address = 'Address is required';

        if(!req.body.email || req.body.email === null || req.body.email === '') req.errs.email = 'Email is required';
        else {
            let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!pattern.test(req.body.email.toString().toLowerCase())) req.errs.email = 'Please enter a correct email!';
        }

        if(!req.body.phone || req.body.phone === null || req.body.phone === '') req.errs.phone = 'Phone is required';

        next();
    },

    insertOne: (req, res, next) => {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }
        let user = new model(req.body);
        user.save(function (err, result) {
            if (err) {
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                console.log(err);
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Add user successfully',
                link: '/manager/dashboard/users-manager/users/create',
                result: result
            };
            next();
        });
    },

    getOne: (req, res, next) => {
        if (!req.params.mid || req.successResponse) {
            next();
            return;
        }
        let pipeline = [
            {
                $match: {
                    mid: req.params.mid,
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "account"
                }
            }
        ];

        model.aggregate(pipeline, (err, result) => {
            if (err) {
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                console.log(err);
                next();
                return;
            }

            if (result.length !== 0) {
                req.user = result[0];
            }
            next();
        });
    },

    getList: (req, res, next) => {
        let limit = 10, skip = 0, page = 1, type = 1;
        if (req.query.limit && /^\d+$/.test(req.query.limit)) limit = Math.abs(Number(req.query.limit));
        if (req.query.page && !['-1', '1'].includes(req.query.page) && /^\d+$/.test(req.query.page)) {
            page = Math.abs(Number(req.query.page));
            skip = (page - 1) * limit;
        }
        if (req.query.type && /^\d+$/.test(req.query.type)) type = Math.abs(Number(req.query.type));
        /**
         * Sử dụng mongodb aggregate, $facet
         * Cấu trúc result trả về, bao gồm 2 trường meta và data, meta là thông số phân trang, data là dữ liệu lấy được
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/facet/
         */
        let query = [
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "account"
                }
            },
            {
                $match: {
                    status: 1,
                    'account.type': type
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
            let queryQ = [
                {full_name: pattern},
                {mid: pattern},
                {address: pattern},
                {email: pattern},
                {phone: pattern},
                {birthday: pattern},
                {'account.username': pattern}
            ];
            if (type !== 1) query[1].$match.$or = queryQ;
            else {
                delete query[1].$match['account.type'];
                query[1].$match.$and = [
                    {
                        $or: queryQ
                    },
                    {
                        $or: [
                            {account: {$size: 0}},
                            {'account.type': 1}
                        ]
                    }
                ]
            }
        }
        else if (type === 1) {
            delete query[1].$match['account.type'];
            query[1].$match.$or = [
                {account: {$size: 0}},
                {'account.type': 1}
            ];
        }

        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            console.log(query);
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.users = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                req.users = [];
                next();
                return;
            }
            req.users = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            req.meta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: limit,
                offset: skip,
                page: page,
                q: req.query.q,
                type: type
            };
            next();
        });
    },

    updateOne: (req, res, next) => {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return
        }
        model.findOneAndUpdate({mid: req.params.mid}, {$set: req.body},{new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = req.successResponse = {
                title: 'Success',
                detail: 'Update user successfully',
                link: '/manager/dashboard/users-manager/users/' + req.params.mid,
                result: result
            };
            next();
        });
    },

    responseUsersView: (req, res, next) => {
        res.render('admin/pages/users-manager/users', {
            path: '/users-manager/users',
            users: req.users,
            meta: req.meta,
            link: '/manager/dashboard/users-manager/users'
        });
    },

    responseUsersFormView: (req, res, next) => {
        res.locals.path = '/users-manager/users/create';
        if ((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)) {
            res.render('admin/pages/users-manager/add-user-form');
        }
        else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/users-manager/add-user-form', {
                errs: req.errs,
                user: req.body,
            });
        }
        else {
            res.render('admin/pages/users-manager/add-user-form', {
                user_mid: req.successResponse.result.mid
            });
        }
    },

    responseAccountFormView: (req, res, next) => {
        if (!res.locals) res.locals = {};
        res.locals.page_type = 2;
        res.locals.path = '/users-manager/users';
        res.locals.user_t_title = 'USER INFO';
        res.locals.account_title = 'ADD ACCOUNT';
        res.locals.user = req.user;
        if ((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)) {
            res.render('admin/pages/users-manager/users-form');
        }
        else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/users-manager/users-form', {
                errs: req.errs,
                account: req.body
            });
        }
        else {
            res.render('index', req.successResponse);
        }
    },

    responseUserWithAccountView: (req, res, next) => {
        if (!res.locals) res.locals = {};
        res.locals.page_type = 3;
        res.locals.user_title = 'USER INFO';
        res.locals.account_title = 'ACCOUNT INFO';
        res.locals.path = '/users-manager/users';
        res.render('admin/pages/users-manager/users-form', {
            user: req.user
        })
    }
};