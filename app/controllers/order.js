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
            res.render('client/pages/order', {
                path: '/order',
                customer: req.body,
                cart: JSON.parse(req.cookies.cart)
            });
        } else {
            res.render('index');
        }
    },

    getAndGroupOrder: (req, res, next) => {
        // req.query = {
        //     ofrom: "2018-01-13",
        //     oto: "2017-01-13",
        //     group: ['$dayOfWeek', '$month', '$year'],
        //     datatype: 'order_quantity-ratio-revenue'
        // };
        let pipeline = [
            {
                $match: {
                    status: {
                        $in: [1, 2]
                    }
                }
            },
            {
                $facet: {

                }
            }
        ];

        if (req.query.ofrom) {
            if (!pipeline[0].$match.$and) pipeline[0].$match.$and = [];
            pipeline[0].$match.$and.push({
                created_at: {
                    $gt: new Date(req.query.ofrom)
                }
            });
        }

        if (req.query.oto) {
            if (!pipeline[0].$match.$and) pipeline[0].$match.$and = [];
            pipeline[0].$match.$and.push({
                created_at: {
                    $lt: new Date(req.query.oto)
                }
            });
        }

        let dataTypes, group = '$dayOfWeek';
        if (req.query.datatype) {
            dataTypes = req.query.datatype.split('-');
        } else dataTypes = ['order_quantity','ratio','revenue'];

        if (req.query.group) {
            group = req.query.group;
        }

        dataTypes.forEach((dataType) => {
            if (dataType === 'order_quantity') {
                pipeline[1].$facet[dataType] = [
                    {
                        $group: {
                            _id: {},
                            quantity: {
                                $sum: 1
                            }
                        }
                    }
                ];
                pipeline[1].$facet[dataType][0].$group._id[group] = "$created_at";
            }

            if (dataType === 'revenue') {
                pipeline[1].$facet[dataType] = [
                    {
                        $group: {
                            _id: {},
                            revenue: {
                                $sum: '$total'
                            }
                        }
                    },
                    {
                        $sort: {
                            _id: 1
                        }
                    },
                ];
                pipeline[1].$facet[dataType][0].$group._id = {
                    day: {$dayOfMonth : "$created_at"},
                    month: {$month: "$created_at"},
                    year: {$year: "$created_at"}
                }
            }

            if (dataType === 'ratio') {
                pipeline[1].$facet.product_quantity = [
                    {
                        $unwind: '$products'
                    },
                    {
                        $group: {
                            _id: '$products._id',
                            quantity: {$sum: '$products.quantity'}
                        }
                    },
                    {
                        $sort: {
                            quantity: -1
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'content'
                        }
                    }
                ];
                pipeline[1].$facet.total_products_quantity = [
                    {
                        $unwind: '$products'
                    },
                    {
                        $group: {
                            _id: null,
                            quantity: {$sum: '$products.quantity'}
                        }
                    }
                ];
            }
        });

        model.aggregate(pipeline, (err, result) => {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                return next();
            }
            res.locals.chart_data = result;
            next();
        });
    }
};