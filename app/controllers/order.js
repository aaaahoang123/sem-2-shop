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


    getList: (req, res, next) => {
        let limit = 10, skip = 0, cpage = 1;
        if (req.query.limit && /^\d+$/.test(req.query.limit)) limit = Math.abs(Number(req.query.limit));
        if (req.query.cpage && !['-1', '1'].includes(req.query.cpage) && /^\d+$/.test(req.query.cpage)) {
            cpage = Math.abs(Number(req.query.cpage));
            skip = (cpage - 1) * limit;
        }
        /**
         * Sử dụng mongodb aggregate, $facet
         * Cấu trúc result trả về, bao gồm 2 trường meta và data, meta là thông số phân trang, data là dữ liệu lấy được
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/facet/
         */

        let query = [
                {
                    "$match" : {
                        "status" : {
                            "$in": [0,1,2]
                        }
                    }
                },
                {
                    "$unwind" : "$products"
                },
                {
                    "$lookup" : {
                        "from" : "products",
                        "localField" : "products._id",
                        "foreignField" : "_id",
                        "as" : "ps"
                    }
                },
                {
                    "$group" : {
                        "_id" : "$_id",
                        "status" : {
                            "$first" : "$status"
                        },
                        "receiver_email" : {
                            "$first" : "$receiver_email"
                        },
                        "receiver_phone" : {
                            "$first" : "$receiver_phone"
                        },
                        "receiver_city" : {
                            "$first" : "$receiver_city"
                        },
                        "receiver_district" : {
                            "$first" : "$receiver_district"
                        },
                        "receiver_address" : {
                            "$first" : "$receiver_address"
                        },
                        "created_by" : {
                            "$first" : "$created_by"
                        },
                        "updated_by" : {
                            "$first" : "$updated_by"
                        },
                        "created_at" : {
                            "$first" : "$created_at"
                        },
                        "updated_at" : {
                            "$first" : "$updated_at"
                        },
                        "total" : {
                            "$first" : "$total"
                        },
                        "products" : {
                            "$push" : {
                                "$arrayToObject" : {
                                    "$setUnion" : [
                                        {
                                            "$objectToArray" : "$products"
                                        },
                                        {
                                            "$objectToArray" : {
                                                "$arrayElemAt" : [
                                                    "$ps",
                                                    0.0
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    '$facet': {
                        meta: [{$count: "totalItems"}],
                        data: [{$skip: skip}, {$limit: limit}] // add projection here wish you re-shape the docs
                    }
                }
            ];

        /**
         * Nếu có tìm kiếm, tạo match và đẩy vào đầu array query
         * Tham khảo: https://docs.mongodb.com/manual/reference/operator/aggregation/match/
         */
        if (req.query.oq) {
            let pattern = new RegExp(req.query.oq, 'i');
            query[0].$match.$or = [
                {receiver_address: pattern},
                {receiver_phone: pattern},
                {receiver_email: pattern}
            ];
        }

        if(req.query.ofrom) {
            query[0].$match.$and = [];
            query[0].$match.$and.push({
                "created_at" : {
                    $gt : new Date(req.query.ofrom)
                }
            })
        }

        if(req.query.oto) {
            query[0].$match.$and = [];
            query[0].$match.$and.push({
                "created_at" : {
                    $lt: new Date(req.query.oto)
                }
            })
        }

        if(req.query.os) {
            query[0].$match.status = Number(req.query.os);
        }

        if(req.query.oc) {
            query[0].$match.receiver_city = Number(req.query.oc);
        }

        if(req.query.od) {
            query[0].$match.receiver_district = Number(req.query.od);
        }


        // Thực thi aggregate query
        model.aggregate(query, function (err, result) {
            if (err) {
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                next();
                return;
            }
            console.log(result);
            // Kết quả trả về có dạng [{meta: [{}], data: [{}]}]. Trong trường hợp không tìm thấy thì đặt res.locals.brands = [] và next()
            if (result.length === 0 || result[0].meta.length === 0) {
                res.locals.orders = [];
                return next();
            }
            res.locals.orders = result[0].data;
            let totalItems = result[0].meta[0].totalItems;
            res.locals.meta = {
                totalItems: totalItems,
                total: Math.ceil(totalItems / limit),
                limit: limit,
                offset: skip,
                cpage: cpage,
                q: req.query.q
            };
            console.log(res.locals.orders);
            next();
        });
    },

    editOne: (req, res, next)=>{
        let query = {
            _id: req.params._id
        };
        let st = 0;
        if(req.params.type === 'reject') st = -1;
        else if(req.params.type === 'accept') st = 2;
        else if(req.params.type === 'done') st = 1;
        model.findOneAndUpdate(query, {$set: {status: st, updated_at: Date.now()}}, {new: true}, function (err, result) {
            if(err){
                console.log(err);
                if (!res.locals.errs) req.res.locals = {};
                res.locals.errs.database = res.locals.message;
                return next();
            }
            if(result === null) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs["404"] = 'Orders not found';
                return next();
            }
            res.locals = {
                title: 'Success',
                detail: 'Update Orders successfully',
                link: '/manager/dashboard/orders',
                result: result
            };
            next();
        });
    },

    responseJson: function (req, res) {
        if(res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json(res.locals.errs);
            return;
        }
        res.status(200);
        res.json(res.locals.result);
    },

    responseOrdersTable: (req, res) => res.render('admin/pages/orders', {path: '/orders'}),

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
    }

};