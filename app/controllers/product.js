'use strict';
const model = require('../models/product');
module.exports = {
    getOne: function (req, res, next) {
        let query = {
            code: req.params.code
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            req.products = result;
            next();
        });
    },

    productView: function (req, res, next) {
        let length = req.products.length;
        console.log(req.products);
        res.locals.path = '/products-manager/products';
        if (length === 0) {
            res.render('admin/pages/products-manager/products', {
                type: 0,
            });
        }
        else if (length === 1) {
            res.render('admin/pages/products-manager/products', {
                type: 1,
                products: req.products,
            });
        }
        else {
            res.render('admin/pages/products-manager/products', {
                type: 2,
                products: req.products
            });
        }
    },

    getList: function (req, res, next) {
        let limit = 10, offset = 0, page = 1;
        if(req.query.limit) limit = Number(req.query.limit);
        if (req.query.page) {
            page = Number(req.query.page);
            offset = (page-1)*limit;
        }
        model.paginate({}, { offset: offset, limit: limit }).then(function(result) {
            if (!res.locals) res.locals = {};
            res.locals.products = result.docs;
            res.locals.meta = {
                total: result.total,
                limit: result.limit,
                offset: result.offset,
                page: page
            };
            next();
        });

    }
};

