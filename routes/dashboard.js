const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product'),
    brandController = require('../app/controllers/brand'),
    cdController = require('../app/controllers/city-and-district');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/pages/index', {path: '/'});
}).get('/home', function (req, res, next) {
    res.render('admin/pages/home');
}).get('/user', function (req, res, next) {
    res.render('admin/pages/user');
})
    .get('/orders', cdController.getAllCities, (req, res) => res.render('admin/pages/orders', {path: '/orders'}));

router.use('/web-config', express.Router()
    .get('/information', function (req, res, next) {
        res.render('admin/pages/web-config/information', {path:'/web-config/information'});
    }).get('/top-category', function (req, res, next) {
        res.render('admin/pages/web-config/top-category', {path:'/web-config/top-category'});
    }).get('/contact', function (req, res, next) {
        res.render('admin/pages/web-config/contact', {path:'/web-config/contact'});
    })
);

router
    .use('/products-manager', require('./products-manager'))
    .use('/users-manager', require('./users-manager'));

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