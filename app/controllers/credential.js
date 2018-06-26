'use strict';

const model = require('../models/credential');
const bcrypt = require('bcrypt');

module.exports = {
    insertOne: (req, res, next) => {
        if (req.account && req.isComparePassword) {
            let cre = {
                account_id: req.account._id,
                token: bcrypt.hashSync(req.account.username, Math.floor((Math.random() * 10) + 1)),
                type: req.account.type
            };
            cre = new model(cre);
            cre.save((err, result) => {
                if (err) {
                    if (err.code === 11000) {
                        this(req, res, next);
                    }
                    else {
                        console.log(err);
                        if (!req.errs) req.errs = {};
                        req.errs.database = err.message;
                        next();
                        return;
                    }
                }
                req.credential = result;
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
            status: 1
        };

        model.findOne(query, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }

            if (result === null || result.expired_at < Date.now()) {
                req.acceptCredential = false;
                if (!req.errs) req.errs = {};
                if (result === null) req.errs.credential = "Token not found";
                else {
                    req.errs.credential = 'Token is out of date, please log out and try again';
                    model.findOneAndUpdate(query, {$set: {status: -1}}, (err1, result1) => {
                        if (err1) console.log(err1);
                        else console.log(result1);
                    })
                }
                next();
                return;
            }
            req.credential = result;
            req.acceptCredential = true;
            next();
        });
    },

    checkAdminEmployeeCredential: (req, res, next) => {
        if (!req.acceptCredential) {
            next();
            return;
        }
        if (![0,2].includes(req.credential.type)) {
            if (!req.errs) req.errs = {};
            req.errs.credential = 'The account can not use this page';
            req.acceptCredential = false;
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
        if (req.errs && Object.keys(req.errs).length !== 0 && !req.headers.contentType) {
            res.render('index', {
                title: 'Credential error',
                detail: req.errs.credential,
                link: '/manager'
            });
            return;
        }
        next();
    },

};