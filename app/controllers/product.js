'use strict';

var model = require('../models/product');

module.exports = {
    add: function (req, res, next) {
        var newProduct = new model(req.body);
        newProduct.save(function (err, result) {
            if(err){
                res.status(500);
                res.render('index',{
                    title: 500,
                    detail: 'Server Error',
                    link: '/manager/dashboard/products-manager/add-product'
                });
            }
            res.render('index', {title: 'Success', detail: 'Add Product Success', link: '/manager/dashboard/products-manager/add-product'});
        })
    }

};
