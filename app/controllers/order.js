'use strict';

const model = require('../models/order');
const mongoose = require('mongoose');

module.exports = {
    validate: (req, res, next) => {
        if (!res.locals.acceptCredential) return next();

        if (!req.cookies.cart) return next();

        if (!res.locals.errs) res.locals.errs = {};

        if (!req.body.receiver_address || req.body.receiver_address === null || req.body.receiver_address === "") res.locals.errs.receiver_address = "Please enter the receiver address";
        if (!req.body.receiver_phone || req.body.receiver_phone === null || req.body.receiver_phone === "") res.locals.errs.receiver_phone = "Please enter the receiver phone";
        if (!req.body.receiver_email || req.body.receiver_email === null || req.body.receiver_email === "") res.locals.errs.receiver_email = "Please enter the receiver email";
        if (!req.body.receiver_city || req.body.receiver_city === null || req.body.receiver_city === "") res.locals.errs.receiver_city = "Please enter the receiver city";
        if (!req.body.receiver_district || req.body.receiver_district === null || req.body.receiver_district === "") res.locals.errs.receiver_district = "Please enter the receiver district";
        next();
    },

    insertOne: (req, res, next) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            next();
            return;
        }
        let cart = JSON.parse(req.cookies.cart);
        console.log(res.locals.rvProducts);
        let products = res.locals.rvProducts;

        products.forEach(function (pr) {
            pr.quantity = cart[pr.code].quantity;
        });
        req.body.products = products;
        req.body.created_by = res.locals.credential.account_id;
        req.body.updated_by = res.locals.credential.account_id;
        let newOrder = new model(req.body);
        newOrder.save(function (err, result) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            res.locals = {
                title: 'Success',
                detail: 'Order successfully',
                link: '/',
                result: result,
                status: 201
            };
            if (req.newCart) res.cookie('cart', JSON.stringify(req.newCart));
            next();
        })
    },

    responseInsertOneCustomerFormView: (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            console.log(res.locals.errs);
            res.render('client/pages/order', {
                path: '/order',
                customer: req.body
            });
        } else {
            res.render('index');
        }
    },
};