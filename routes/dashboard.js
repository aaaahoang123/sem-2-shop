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

router.use('/products-manager', express.Router()
    .get('/categories', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/add-category', function(req, res, next){
        res.render('admin/pages/demo');
    }).get('/brands', function (req, res, next) {
        res.render('admin/pages/product-manager/brands', {path:'/product-manager/brands'});
    }).get('/add-brand', function(req, res, next){
        res.render('admin/pages/demo');
    }).get('/products', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/add-product', function(req, res, next){
        res.render('admin/pages/products-manager/products-form', {path: '/products-manager/add-product'});
    })
);

router.use('/customer-manager', express.Router()
    .get('/customers', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/add-customer', function (req, res, next) {
        res.render('admin/pages/demo');
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