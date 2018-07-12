'use strict';

const express = require('express');
const router = express.Router({});
const webConfigController = require('../app/controllers/web-config');

const categoryController = require('../app/controllers/category');
const productController = require('../app/controllers/product');
const brandController = require('../app/controllers/brand');
const renderer = require('../app/controllers/client'),
    userController = require('../app/controllers/user'),
    accountController = require('../app/controllers/account'),
    credentialController = require('../app/controllers/credential');

router.use('/*', categoryController.findAll, (req, res, next) => {
    if (req.cookies.token) res.locals.logedIn = true;
    if (req.cookies.username) res.locals.username = req.cookies.username;
    res.locals.webConfig = require('../app/resource/web-config');
    res.locals.cartLength = 0;
    console.log(req.cookies.cart);
    if (req.cookies.cart) {
        res.locals.cartLength = Object.keys(JSON.parse(req.cookies.cart)).length;
    }
    next();
});
/* GET home page. */

router.get('/', webConfigController.getTopCategories,
    productController.setProductCodeArrayFromCookie,
    productController.getProductByCodesArray,
    brandController.getList,
    renderer.renderHomePage);

router.get('/blog', function(req, res, next) {
    res.render('client/pages/blog');
});

router.get('/blog_single', function(req, res, next) {
    res.render('client/pages/blog_single');
});

router.get('/cart',productController.setProductCodeArrayFromCart, productController.getProductByCodesArray, function(req, res, next) {
    let cart = {};
    if (req.cookies.cart) cart = JSON.parse(req.cookies.cart);
    res.render('client/pages/cart', {cart: cart});
});

router.get('/contact', function(req, res, next) {
    res.render('client/pages/contact');
});

router.get('/product/:code',categoryController.findAll,
    productController.getOne,
    productController.setProductCodeArrayFromCookie,
    productController.getProductByCodesArray,
    brandController.getList, function(req, res, next) {
    res.render('client/pages/product', {products: req.products});
});

router.get('/regular', categoryController.findAll,function(req, res, next) {
    res.render('client/pages/regular');
});

router.get('/shop', categoryController.findAll, categoryController.getOne,
    brandController.getList, brandController.getOne,
    productController.getMaxPrice,
    productController.setProductCodeArrayFromCookie,
    productController.getProductByCodesArray,
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

router.get('/register', (req, res) => res.render('client/pages/register'))
    .post('/register', userController.validate,
        (req,res,next) => {req.body.type = 1;next()},
        accountController.validate,
        userController.insertOne,
        accountController.setUserIdAfterInsertUser,
        accountController.insertOne,
        (req, res) => {
            if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
                console.log(res.locals.errs);
                res.render('client/pages/register', {user_account: req.body});
                return;
            }
            res.redirect('/sign-in', 200);
        });

router.get('/sign-in', (req, res) => res.render('client/pages/sign-in'))
    .post('/sign-in', accountController.getOne, accountController.comparePassword, credentialController.insertOne, (req, res) => {
        if (res.locals.errs) {
            res.render('client/pages/sign-in', {account: req.body});
            return;
        }
        res.cookie('token', res.locals.credential.token);
        res.cookie('username', res.locals.account.username);
        res.redirect('/');
    });
module.exports = router;
