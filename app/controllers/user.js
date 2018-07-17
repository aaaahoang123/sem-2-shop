'use strict';

const model = require('../models/user');

module.exports = {

    validate: (req, res, next) => {
        if(!res.locals.errs) res.locals.errs = {};

        if(!req.body.full_name || req.body.full_name === null || req.body.full_name === '') res.locals.errs.full_name = 'Full name is required';

        if(!req.body.gender || req.body.gender === null || req.body.gender === '') res.locals.errs.gender = 'Gender is required';

        if (req.body.birthday && req.body.birthday !== '' && new Date(req.body.birthday) > Date.now()) res.locals.errs.birthday = 'Your birthday must be sooner than today!';

        if(!req.body.address || req.body.address === null || req.body.address === '') res.locals.errs.address = 'Address is required';

        if(!req.body.email || req.body.email === null || req.body.email === '') res.locals.errs.email = 'Email is required';
        else {
            let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!pattern.test(req.body.email.toString().toLowerCase())) res.locals.errs.email = 'Please enter a correct email!';
        }

        if(!req.body.phone || req.body.phone === null || req.body.phone === '') res.locals.errs.phone = 'Phone is required';

        next();
    },

    insertOne: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            next();
            return;
        }
        let user = new model(req.body);
        user.save(function (err, result) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                console.log(err.code);
                return next();
            }
            res.locals = Object.assign(res.locals, {
                title: 'Success',
                detail: 'Add user successfully',
                link: '/manager/users-manager/users/create',
                result: result
            });
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
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                console.log(err);
                next();
            }

            if (result.length !== 0) {
                res.locals.user = result[0];
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
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt req.users = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                res.locals.users = [];
                return next();
            }
            res.locals.users = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            res.locals.meta = {
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
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();

        req.body.updated_at = Date.now();
        model.findOneAndUpdate({mid: req.params.mid}, {$set: req.body},{new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Update user successfully',
                link: '/manager/users-manager/users/' + req.params.mid,
                result: result
            };
            next();
        });
    },

    deleteOne: (req, res, next) => {
        let query = {mid: req.params.mid};
        if (req.rollBack === false) {
            next();
            return;
        }
        else {
            var status = req.rollBack?1:-1;
        }
        model.findOneAndUpdate(query, {$set: {status: status}}, {new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if(result === null) {
                if (!req.errs) req.errs = {};
                req.errs["404"] = 'User not found';
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Delete user successfully',
                link: '/manager/users-manager/users',
                result: result
            };
            next();
        })
    },

    deleteMulti: (req, res, next) => {
        if (req.rollBack === false) {
            next();
            return;
        }
        else {
            var status = req.rollBack?1:-1;
        }
        if (!req.body["chosen[]"] || req.body["chosen[]"].length === 0) {
            res.status(404);
            res.json({
                status: 404,
                detail: "Please choose some user to delete"
            });
            return;
        }
        let query = {
            _id: {
                $in: req.body["chosen[]"]
            }
        };
        model.update(query, {$set: {status: status}}, {multi: true}, (err, affected) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = {
                title: 'Success',
                detail: 'Delete users successfully',
                link: '/manager/users-manager/users',
                result: affected
            };
            next();
            //res.json(affected);
        })

    },

    responseUsersView: (req, res) => {
        res.render('admin/pages/users-manager/users', {
            path: '/users-manager/users',
            link: '/manager/users-manager/users'
        });
    },

    responseInsertOneByUsersFormView: (req, res) => {
        res.locals.path = '/users-manager/users/create';

        if (!res.locals.errs || Object.keys(res.locals.errs).length === 0) {
            res.locals.user_mid = res.locals.result.mid
        }
        res.render('admin/pages/users-manager/add-user-form');
    },

    responseUserWithAccountView: (req, res) => {
        res.cookie('user', res.locals.user);
        res.render('admin/pages/users-manager/index', {
            path: '/users-manager/users',
            method: 'PUT'
        })
    },

    responseUpdateByUAView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length > 0) {
            res.locals.user = req.cookies.user;
            res.locals.user = Object.assign(res.locals.user, req.body);
            res.render('admin/pages/users-manager/index', {
                path: '/users-manager/users',
                method: 'PUT'
            });
            return;
        }
        res.redirect(`/manager/users-manager/users/${req.params.mid}?message=edit-user-success`);
    }
};