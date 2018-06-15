const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/pages/index', {path: '/'});
}).get('/home', function (req, res, next) {
    res.render('admin/pages/home');
}).get('/user', function (req, res, next) {
    res.render('admin/pages/user');
});

router.use('/web-config', express.Router()
    .get('/information', function (req, res, next) {
        res.render('admin/pages/web-config/information', {path:'/web-config/information'});
    }).get('/top-category', function (req, res, next) {
        res.render('admin/pages/web-config/top-category', {path:'/web-config/top-category'});
    }).get('/contact', function (req, res, next) {
        res.render('admin/pages/web-config/contact', {path:'/web-config/contact'});
    })
);

router.use('/product-manager', express.Router()
    .get('/categories', function (req, res, next) {
        res.render('admin/pages/product-manager/categories', {path: '/product-manager/categories'});
    }).get('/add-category', function(req, res, next){
        res.render('admin/pages/product-manager/categories-form', {path: '/product-manager/add-category'});
    }).get('/brands', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/add-brand', function(req, res, next){
        res.render('admin/pages/demo');
    }).get('/products', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/add-product', function(req, res, next){
        res.render('admin/pages/demo');
    })
);

router.use('/customer-manager', express.Router()
    .get('/customers', function (req, res, next) {
        res.render('admin/pages/customer-manager/customers', {path: '/customer-manager/customers'});
    }).get('/add-customer', function (req, res, next) {
        res.render('admin/pages/customer-manager/customers-form', {path: '/customer-manager/add-customer'});
    })
);

router.use('/warehouse-manager', express.Router()
    .get('/check', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/edit', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/logs', function (req, res, next) {
        res.render('admin/pages/demo');
    })
);

module.exports = router;