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
    }
};