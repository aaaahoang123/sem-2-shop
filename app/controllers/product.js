'use strict';

const model = require('../models/product');

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
            req.products = [
                result
            ];
        });
        next();
    }
};

