'use strict';

const model = require('../models/account');
const bcrypt = require('bcrypt');

module.exports = {

    /**
     * Validate account, các trường không được null, rỗng
     * Nếu có lỗi, pass lỗi vào res.locals và next()
     * @param req
     * @param res
     * @param next
     */
    validate: (req, res, next) => {
        if (!res.locals.errs) res.locals.errs = {};
        let errs = res.locals.errs;

        if (!req.body.username) errs.username = "Please enter username!";
        else if (req.body.username.length < 8) errs.username = "Username must have at least 8 character";

        if (!req.body.password) errs.password = "Please enter password!";
        else if (req.body.password.length < 8) errs.password = "Password must have at least 8 character";

        if (!req.body.type) errs.type = "Type is required";

        //if (!req.body.user_id) errs.user_id = "Please show us owner of this account";

        next();
    },

    insertOne: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            return next();
        }

        let op = req.body.password;
        req.body.password = bcrypt.hashSync(req.body.password, Math.floor((Math.random() * 10) + 1));
        let account = new model(req.body);

        account.save((err, result) => {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                if (err.code === 11000) res.locals.errs.username = "This username has already existed";
                else res.locals.errs.database = err.message;
                req.body.password = op;
                res.locals.account = req.body;
                if (!req.params) req.params = {};
                req.params.mid = res.locals.result.mid;
                return next();
            }
            req.rollBack = false;
            res.locals = Object.assign(res.locals, {
                result: result,
                title: 'Success',
                detail: 'Add account successfully',
                link: '/manager/users-manager/users/' + req.params.mid,
            });
            next();
        });
    },

    /**
     * get One account by username
     * @param req
     * @param res
     * @param next
     */
    getOne: (req, res, next) => {
        let username;
        if (req.params.username) username = req.params.username;
        else if (req.body.username) username = req.body.username;
        else if (req.query.username) username = req.query.username;
        else {
            next();
            return;
        }

        model.findOne({username: username, status: 1}, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
            }
            res.locals.account = result;
            next();
        });
    },

    updateOne: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.locals.dataUser.account = [req.body];
            next();
            return;
        }
        const op = req.body.password;
        if (op !== res.locals.account.password) {
            req.body.password = bcrypt.hashSync(op, Math.floor((Math.random() * 10) + 1));
        }
        req.body.updated_at = Date.now();
        model.findOneAndUpdate({username: res.locals.account.username}, {$set: req.body}, {new: true}, (err, result) => {
            if (err) {
                console.log(err);
                let dataUser = res.locals.dataUser;
                dataUser.account = [req.body];
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                res.locals.dataUser = dataUser;
                req.body.password = op;
                next();
                return;
            }
            let dataUser = res.locals.dataUser;
            dataUser.account = [result];
            res.locals = Object.assign(res.locals, {
                title: 'Success',
                detail: 'Update account successfully',
                link: '/manager/dashboard/users-manager/users/',
                result: result,
                dataUser: dataUser
            });
            next();
        });
    },

    /**
     * Delete one account after delete an user, when delete user success, the req.successResponse.result._id will be the id of deleted user
     * @param req
     * @param res
     * @param next
     */
    deleteOne: (req, res, next) => {
        if (!req.successResponse) {
            next();
            return;
        }
        let query = {user_id: req.successResponse.result._id};
        model.findOneAndUpdate(query, {$set: {status: -1}}, {new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                req.rollBack = true;
                next();
                return;
            }
            req.accountSuccessResponse = {
                title: 'Success',
                detail: 'Delete User and Account successfully',
                link: '/manager/users-manager/users',
                result: result
            };
            req.rollBack = false;
            next();
        })
    },

    /**
     * Compared password sau khi đã get được account theo username, nếu đúng thì set req.isComparePassword = true, sai thì thêm mỗi req.errs.password
     * @param req
     * @param res
     * @param next
     */
    comparePassword: (req, res, next) => {
        if (!res.locals.account) {
            next();
            return;
        }

        req.isComparePassword = bcrypt.compareSync(req.body.password, res.locals.account.password);
        if (!req.isComparePassword) {
            if (!res.locals.errs) res.locals.errs = {};
            res.locals.errs.password = 'Password not match';
        }
        next();
    },

    deleteMulti: (req, res, next) => {
        if (req.errs && Object.keys(req.errs).length > 0) {
            next();
            return;
        }
        let query = {
            user_id: {
                $in: req.body["chosen[]"]
            }
        };
        model.update(query, {$set: {status: -1}}, {multi: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                req.rollBack = true;
                next();
                return;
            }
            req.accountSuccessResponse = {
                title: 'Success',
                detail: 'Delete Users and Accounts successfully',
                link: '/manager/users-manager/users',
                result: result
            };
            req.rollBack = false;
            next();
        });
    },

    responseDeleteJson: (req, res) => {
        if (req.errs) {
            res.status(409);
            res.json(req.errs);
            return;
        }
        res.status(200);
        res.json([req.successResponse.result, req.accountSuccessResponse.result]);
    },

    responseInsertOneByAccountFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/users-manager/accounts-form', {
                path: '/users-manager/users',
                account: req.body,
                user: req.cookies.user
            });
        } else {
            res.redirect(`/manager/users-manager/users/${req.params.mid}?message=add-account-success`);
        }
    },

    responseUpdateByUAView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            let user = req.cookies.user;
            user.account = [req.body];
            res.render('admin/pages/users-manager/index', {
                path: '/users-manager/users',
                user: user,
                method: 'PUT'
            });
            return;
        }
        res.redirect(`/manager/users-manager/users/${req.params.mid}?message=edit-account-success`);
    },

    setUserIdAfterInsertUser: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();
        req.body.user_id = res.locals.result._id;
        req.body.type = 1;
        next();
    }
};