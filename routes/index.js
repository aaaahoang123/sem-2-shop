'use strict';

const express = require('express');
const router = express.Router({});

const categoryController = require('../app/controllers/category');
const productController = require('../app/controllers/product');
const brandController = require('../app/controllers/brand');
const renderer = require('../app/controllers/client');

router.use('/*', categoryController.findAll);
/* GET home page. */
router.get('/', renderer.renderHomePage);

router.get('/blog', function(req, res, next) {
    res.render('client/pages/blog');
});

router.get('/blog_single', function(req, res, next) {
    res.render('client/pages/blog_single');
});

router.get('/cart', function(req, res, next) {
    res.render('client/pages/cart');
});

router.get('/contact', function(req, res, next) {
    res.render('client/pages/contact');
});

router.get('/product/:code',categoryController.findAll, productController.getOne, brandController.getList, function(req, res, next) {
    res.render('client/pages/product', {products: req.products});
});

router.get('/regular', categoryController.findAll,function(req, res, next) {
    res.render('client/pages/regular');
});

router.get('/shop', categoryController.findAll,
    categoryController.getOne,
    brandController.getList,
    brandController.getOne,
    productController.getMaxPrice, productController.recentlyViewed,
    productController.getList,
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

// router.put('/', function (req, res, next) {
//     console.log('abc');
//     res.send('âcc');
// });

module.exports = router;
