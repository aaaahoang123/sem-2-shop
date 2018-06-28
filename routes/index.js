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
    res.render('client/pages/blog', {categories: req.categories});
});

router.get('/blog_single', function(req, res, next) {
    res.render('client/pages/blog_single', {categories: req.categories});
});

router.get('/cart', function(req, res, next) {
    res.render('client/pages/cart', {categories: req.categories});
});

router.get('/contact', function(req, res, next) {
    res.render('client/pages/contact', {categories: req.categories});
});

router.get('/product/:code',categoryController.findAll, productController.getOne, brandController.getList, function(req, res, next) {
    res.render('client/pages/product', {products: req.products});
});

router.get('/regular', categoryController.findAll,function(req, res, next) {
    res.render('client/pages/regular', {categories: req.categories});
});

router.get('/shop', categoryController.findAll, function(req, res, next) {
    res.render('client/pages/shop');
});

// router.put('/', function (req, res, next) {
//     console.log('abc');
//     res.send('âcc');
// });

module.exports = router;
