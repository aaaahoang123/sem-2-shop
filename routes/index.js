'use strict';

const express = require('express');
const router = express.Router({});

const categoryController = require('../app/controllers/category');
const productController = require('../app/controllers/product');
const brandController = require('../app/controllers/brand');
const renderer = require('../app/controllers/client');

router.use('/*', categoryController.findAll);
/* GET home page. */
router.get('/', productController.recentlyViewed, brandController.getList, renderer.renderHomePage);

router.get('/blog', function(req, res, next) {
    res.render('client/pages/blog');
});

router.get('/blog_single', function(req, res, next) {
    res.render('client/pages/blog_single');
});

router.get('/cart', function(req, res, next) {
    res.render('client/pages/cart');
});

router.get('/order', function(req, res, next) {
    res.render('client/pages/order');
});

router.get('/contact', function(req, res, next) {
    res.render('client/pages/contact');
});

router.get('/product/:code', productController.getOne,
    productController.recentlyViewed,
    brandController.getList, function(req, res, next) {
    res.render('client/pages/product', {products: req.products});
});

router.get('/regular', categoryController.findAll,function(req, res, next) {
    res.render('client/pages/regular');
});

router.get('/shop', categoryController.getOne,
    brandController.getList, brandController.getOne,
    productController.getMaxPrice, productController.recentlyViewed, productController.getList,
    function(req, res, next) {
        res.locals.path = '/shop';
        if (req.products.length === 0) {
            res.render('client/pages/shop', {
                type: 0,
            });
        }
        else if (!req.meta) {
            res.render('client/pages/shop', {
                type: 1,
                products: req.products,
                total: req.total
            });
        }
        else {
            res.render('client/pages/shop', {
                type: 2,
                products: req.products,
                total: req.total,
                meta: req.meta
            });
        }
    }
);

module.exports = router;
