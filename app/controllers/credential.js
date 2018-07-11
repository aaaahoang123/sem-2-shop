'use strict';

const model = require('../models/credential');
const bcrypt = require('bcrypt');

module.exports = {
    insertOne: (req, res, next) => {
        if (res.locals.account && req.isComparePassword) {
            let cre = {
                account_id: res.locals.account._id,
                token: bcrypt.hashSync(res.locals.account.username, Math.floor((Math.random() * 10) + 1)),
                type: res.locals.account.type
            };
            cre = new model(cre);
            cre.save((err, result) => {
                if (err) {
                    if (err.code === 11000) {
                        this(req, res, next);
                    }
                    else {
                        console.log(err);
                        if (!res.locals.errs) res.locals.errs = {};
                        res.locals.errs.database = err.message;
                        next();
                        return;
                    }
                }
                res.locals.credential = result;
                next();
            })
        } else next();
    },

    setTokenFromCookie: (req, res, next) => {
        req.token = req.cookies.token;
        next();
    },

    checkCredential: (req, res, next) => {
        const query = {
            token: req.token,
        };

        const pipline = [
            {
                $match: {
                    token: req.token,
                    status: 1
                }
            },
            {
                $lookup: {
                    from: 'accounts',
                    localField: 'account_id',
                    foreignField: '_id',
                    as: 'account'
                }
            }
        ];
        model.aggregate(pipline, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }

            if (!result || result.length === 0 || result.expired_at < Date.now()) {
                req.acceptCredential = false;
                if (!res.locals.errs) res.locals.errs = {};
                if (!result || result.length === 0) res.locals.errs.credential = "Token not found";
                else {
                    res.locals.errs.credential = 'Token is out of date, please log out and try again';
                    model.findOneAndUpdate(query, {$set: {status: -1}}, (err1, result1) => {
                        if (err1) console.log(err1);
                        else console.log(result1);
                    })
                }
                return next();
            }
            res.locals.credential = result[0];
            res.locals.acceptCredential = true;
            next();
        });
    },

    checkAdminEmployeeCredential: (req, res, next) => {
        if (!res.locals.acceptCredential) return next();

        if (![0,2].includes(res.locals.credential.type)) {
            if (!res.locals.errs) res.locals.errs = {};
            res.locals.errs.credential = 'The account can not use this page';
            res.locals.acceptCredential = false;
        }
        next();
    },

    /**
     * Sau khi đã check credential, sẽ chạy đến hàm này.
     * Nếu có lỗi, trả về trang báo lỗi, cho redirect lại trang đăng nhập
     * Nếu không lỗi, cho đi tiếp bằng next()
     * @param req
     * @param res
     * @param next
     */
    acceptPermissionAfterCheck: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0 && !req.headers.contentType) {
            res.render('index', {
                title: 'Credential error',
                detail: res.locals.errs.credential | res.locals.errs.database,
                link: '/manager'
            });
            return;
        }
        next();
    }
};