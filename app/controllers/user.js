'use strict';

const model = require('../models/user');

module.exports = {

    validate: function(req, res, next) {
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

    insertOne: function(req, res, next) {
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

    responseUsersView: function (req, res, next) {
        res.render('admin/pages/users-manager/users', {path: '/users-manager/users'});
    },

    responseUsersFormView: function (req, res, next) {
        if ((!req.errs || Object.keys(req.errs).length === 0) && (!req.successResponse || Object.keys(req.successResponse).length === 0)) {
            res.render('admin/pages/users-manager/users-form', {path: '/users-manager/users/create', title: 'ADD USER'});
        }
        else if (req.errs && Object.keys(req.errs).length !== 0) {
            res.render('admin/pages/users-manager/users-form', {
                path: '/users-manager/users/create',
                errs: req.errs,
                user: req.body,
                title: 'ADD USER'
            });
        }
        else {
            res.render('admin/pages/users-manager/users-form', {
                path: '/users-manager/users/create',
                title: 'ADD USER',
                user_mid: req.successResponse.result.mid
            });
        }
    }
};