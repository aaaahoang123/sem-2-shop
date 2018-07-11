'use strict';

const model = require('../models/order');
const mongoose = require('mongoose');

module.exports = {
    validate: (req, res, next) => {
        //if (!res.locals.acceptCredential) return next();

        //if (!req.cookies.cart) return next();

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
        // let cart = JSON.parse(req.cookies.cart);
        // let products = res.locals.rvProducts.foreach(function (pr) {
        //     pr = Object.assign(pr, cart[pr.code])
        // }).filter(function (pr) {
        //     return pr.selected;
        // });
        // req.body.products = products;
        req.body.created_by = mongoose.Types.ObjectId("507f191e810c19729de860ea");
        req.body.updated_by = mongoose.Types.ObjectId("507f191e810c19729de860ea");
        let newOrder = new model(req.body);
        newOrder.save(function (err, result) {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            res.locals.successResponse = {
                title: 'Success',
                detail: 'Order successfully',
                link: '/manager/dashboard/orders-manager/orders',
                result: result,
                status: 201
            };
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