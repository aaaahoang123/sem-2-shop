const express = require('express');
const router = express.Router();

const cdController = require('../app/controllers/city-and-district');
const productsController = require('../app/controllers/product');
const brandController = require('../app/controllers/brand');
const categoriesController = require('../app/controllers/category');
const topCategoriesController = require('../app/controllers/top-categories');
const contactController = require('../app/controllers/contact');
const informationController = require('../app/controllers/information');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/pages/index', {path: '/'});
}).get('/home', function (req, res, next) {
    res.render('admin/pages/home');
}).get('/user', function (req, res, next) {
    res.render('admin/pages/user');
})
    .get('/orders', cdController.getAllCities, (req, res) => res.render('admin/pages/orders', {path: '/orders'}));


router
    .use('/web-config', require('./web-config'))
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