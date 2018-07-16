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
    credentialController = require('../app/controllers/credential'),
    cityNDistrict = require('../app/controllers/city-and-district'),
    orderController = require('../app/controllers/order'),
    navController = require('../app/controllers/nav-bar'),
    blogController = require('../app/controllers/blog');

router.use('/*', categoryController.findAll, navController.getNavBar, (req, res, next) => {
    if (req.cookies.token) res.locals.logedIn = true;
    if (req.cookies.username) res.locals.username = req.cookies.username;
    res.locals.webConfig = require('../app/resource/web-config');
    res.locals.cartLength = 0;
    console.log(req.cookies.cart);
    if (req.cookies.cart && req.cookies.cart !== []) {
        res.locals.cartLength = Object.keys(JSON.parse(req.cookies.cart)).length;
    }
    next();
});
/* GET home page. */

router.get('/', webConfigController.getTopCategories,
    productController.setProductCodeArrayFromCookie,
    productController.getProductByCodesArray,
    brandController.getList, orderController.getBestSellers,
    renderer.renderHomePage);

router.get('/blog',blogController.setLimit, blogController.getList, function(req, res, next) {
    res.render('client/pages/blog');
});

router.get('/blog_single', function(req, res, next) {
    res.render('client/pages/blog_single')
});
router.get('/blog/:uri_title',blogController.getOne, function(req, res, next) {
    res.render('client/pages/blog_single');
});

router.get('/user',userController.getOneFromToken, function (req, res, next) {
    res.render('client/pages/user');
})
    .put('/user',userController.validate,
        (req,res,next) => {req.body.type = 1;next()},
        accountController.validate,
        userController.setParam,
        userController.updateOne,
        (req, res, next) => {
            if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) return next();
            req.body.user_id = res.locals.result._id;
            res.locals.account = {
                username: req.body.username,
                password: req.body.password
            };
            req.body.type = 1;
            next();
        },
        accountController.updateOne,
        (req, res) => {res.render('client/pages/user')})
;

router.get('/cart',productController.setProductCodeArrayFromCart, productController.getProductByCodesArray, function(req, res, next) {
    let cart = {};
    if (req.cookies.cart) cart = JSON.parse(req.cookies.cart);
    res.render('client/pages/cart', {cart: cart});
});

router.get('/order', credentialController.setTokenFromCookie, credentialController.checkCredential,
    productController.setSelectedProductCodeArrayFromCart, productController.getProductByCodesArray,
    cityNDistrict.getAllCities, function(req, res, next) {
        let cart = {};
        if (req.cookies.cart) cart = JSON.parse(req.cookies.cart);
        res.render('client/pages/order', {cart: cart});
});

router.post('/order', credentialController.setTokenFromCookie, credentialController.checkCredential,
    productController.setSelectedProductCodeArrayFromCart, productController.getProductByCodesArray,
    orderController.validate, orderController.insertOne,
    orderController.responseInsertOneCustomerFormView);

router.get('/contact', function(req, res, next) {
    res.render('client/pages/contact');
});

router.get('/product/:code',categoryController.findAll,
    productController.getOne,
    productController.setProductCodeArrayFromCookie,
    productController.getProductByCodesArray,
    brandController.getList, function(req, res, next) {
    res.render('client/pages/product');
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
        if (res.locals.products.length === 0) {
            res.render('client/pages/shop', {
                type: 0,
            });
        }
        else if (!res.locals.meta) {
            res.render('client/pages/shop', {
                type: 1
            });
        }
        else {
            res.render('client/pages/shop', {
                type: 2
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
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('client/pages/sign-in', {account: req.body});
            return;
        }
        res.cookie('token', res.locals.credential.token);
        res.cookie('username', res.locals.account.username);
        res.redirect('/');
    });

module.exports = router;
