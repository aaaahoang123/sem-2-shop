'use strict';
const model = require('../models/category');

module.exports = {
    validate: function (req, res, next) {
        console.log(req.body);
        if (!req.errs) req.errs = {};
        if (!req.body.name || req.body.name === null || req.body.name === "") req.errs.name = "Category Name can not null";
        if (!req.body.description || req.body.description === null || req.body.description === "") req.errs.description = "Category Description can not null";
        if (!req.body.level || req.body.level === null || req.body.level === "") req.errs.level = "Category level can not null";
        else if (Number(req.body.level) !== 1 && (req.body.parent === null || req.body.parent === '' || !req.body.parent)) req.errs.parent = "Category parent can not null when level is 2 or 3";
        next();
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


    findByLevel: function (req, res, next) {
        if (!req.query.lv || req.query.lv === undefined || !(/^\d+$/.test(req.query.lv))) {
            next();
            return;
        }
        let lv;
        if (req.query.lv && /^\d+$/.test(req.query.lv)) lv = Math.abs(Number(req.query.lv));
        console.log(lv);
        model.find({level: (lv - 1), status: 1}, function (err, result) {
            if (err) {
                console.log(err);
                if (!req.errs) req.errs = {};
                req.errs.database = err.message;
                next();
                return;
            }
            if (result.length === 0) {
                req.listParent = [];
                next();
                return;
            }
            req.listParent = result;
            console.log(result.length);
            next();
        });
    },


    responseFormView: function (req, res, next) {
        let lv = 1;
        if (req.successResponse) {
            res.render('index', req.successResponse);
            return;
        }
        else if (req.listParent) {
            lv = req.query.lv;
            res.render('admin/pages/products-manager/categories-form', {
                path: '/products-manager/categories/create',
                listParent: req.listParent,
                level: lv,
                category: req.body
            });
            console.log(req.body);
        } else if(req.errs && Object.keys(req.errs).length !== 0) {
            lv = req.query.lv;
            res.render('admin/pages/products-manager/categories-form', {
                path: '/products-manager/categories/create',
                level: req.body.level,
                errs: req.errs,
                category: req.body,
            });
            console.log(req.body);
        }
        else {
            res.render('admin/pages/products-manager/categories-form', {
                path: '/products-manager/categories/create',
                level: lv
            });
        }
    }
};