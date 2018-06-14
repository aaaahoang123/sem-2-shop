const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/layouts/master', {path: '/'});
}).get('/home', function (req, res, next) {
    res.render('admin/pages/home');
}).get('/user', function (req, res, next) {
    res.render('admin/pages/user');
});

router.use('/web-config', express.Router()
    .get('/information', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/top-category', function (req, res, next) {
        res.render('admin/pages/website-config/top-category', {path:'/web-config/top-category'});
    }).get('/contact', function (req, res, next) {
        res.render('admin/pages/demo');
    })
);

router.use('/product-manager', express.Router()
    .get('/categories', function (req, res, next) {
        res.render('admin/pages/demo');
    }).get('/add-category', function(req, res, next){
        res.render('admin/pages/demo');
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