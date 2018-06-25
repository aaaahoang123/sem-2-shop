'use strict';

const model = require('../models/account');
const bcrypt = require('bcrypt');

module.exports = {

    validate: (req, res, next) => {
        if (!req.errs) req.errs = {};

        if (!req.body.username) req.errs.username = "Please enter username!";
        else if (req.body.username.length < 8) req.errs.username = "Username must have at least 8 character";

        if (!req.body.password) req.errs.password = "Please enter password!";
        else if (req.body.password.length < 8) req.errs.password = "Password must have at least 8 character";

        if (!req.body.type) req.errs.type = "Type is required";

        if (!req.body.user_id) req.errs.user_id = "Please show us owner of this account";

        next();
    },

    insertOne: (req, res, next) => {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }

        let op = req.body.password;
        req.body.password = bcrypt.hashSync(req.body.password, Math.floor((Math.random() * 10) + 1));
        let account = new model(req.body);

        account.save((err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                if (err.code === 11000) req.errs.username = "This username has already existed";
                req.errs.database = err.message;
                req.body.password = op;
                next();
                return;
            }
            req.successResponse = {
                result: result,
                title: 'Success',
                detail: 'Add account successfully',
                link: '/manager/dashboard/users-manager/users/' + req.params.mid,
            };
            next();
        });
    },

    updateOne: (req, res, next) => {
        if (req.errs && Object.keys(req.errs).length !== 0) {
            next();
            return;
        }
        if (!bcrypt.compareSync(req.body.password, req.account.password)) {
            req.body.password = bcrypt.hashSync(op, Math.floor((Math.random() * 10) + 1));
        }
        model.findOneAndUpdate({username: req.account.username}, {$set: req.body}, {new: true}, (err, result) => {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            req.successResponse = req.successResponse = {
                title: 'Success',
                detail: 'Update account successfully',
                link: '/manager/dashboard/users-manager/users/' + req.params.mid,
                result: result
            };
            next();
        });
    },

    responseAccountFormView: (req, res, next) => {
        if ((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)) {
            res.render('admin/pages/users-manager/accounts-form', {path: '/users-manager/users', user: req.user});
        } else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/users-manager/accounts-form', {
                path: '/users-manager/users',
                errs: req.errs,
                account: req.body,
                user: req.user
            });
        } else {
            res.render('index', req.successResponse);
        }
    },

    getOne: (req, res, next) => {
        let username;
        if (req.params.username) username = req.params.username;
        else if (req.body.username) username = req.body.username;
        else if (req.query.username) username = req.query.username;
        else {
            next();
            return;
        }

        model.find({username: username}, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if (result.length === 0) {
                if (!req.errs) req.errs = {};
                req.errs.username = "This username isn't existed";
                next();
                return;
            }
            req.account = result[0];
        });
    },

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
                link: '/manager/dashboard/users-manager/users',
                result: result
            };
            req.rollBack = false;
            next();
        })
    },

    comparePassword: (req, res, next) => {
        if (!req.account) {
            next();
            return;
        }

        req.isComparedPassword = bcrypt.compareSync(req.body.pasword, req.account.pasword);
        next();
    },

    responseDeleteJson: (req, res) => {
        if (req.errs) {
            res.json(req.errs);
            return;
        }
        res.json([req.successResponse.result, req.accountSuccessResponse.result])
    }
};