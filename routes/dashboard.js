const express = require('express');
const router = express.Router();
const productsController = require('../app/controllers/product');
const brandController = require('../app/controllers/brand')
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
        res.render('admin/pages/products-manager/categories', {path: '/products-manager/categories'});
    }).get('/add-category', function(req, res, next){
        res.render('admin/pages/products-manager/categories-form', {path: '/products-manager/add-category'});
    }).get('/brands', brandController.getList, brandController.productView
    ).get('/add-brand', function(req, res, next){
        res.render('admin/pages/products-manager/brands-form', {path: '/products-manager/add-brand'});
    }).get('/products', productsController.getList, productsController.productView)
    .get('/products/:code', productsController.getOne, productsController.productView)
    .get('/add-product', brandController.responseBrandFormView)

    .post('/products/:code', productsController.getOne)
    .post('/products', productsController.getList)

    .post('/brands/:id', brandController.validate, brandController.insertOne, brandController.getOne)
    .post('/add-brand', brandController.validate, brandController.insertOne, brandController.responseBrandFormView)
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