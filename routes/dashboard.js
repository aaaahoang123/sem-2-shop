const express = require('express');
const router = express.Router();

const cdController = require('../app/controllers/city-and-district'),
    credentialController = require('../app/controllers/credential'),
    productController = require('../app/controllers/product'),
    orderController = require('../app/controllers/order');
const categoriesController = require('../app/controllers/category');
const topCategoriesController = require('../app/controllers/top-categories');
const contactController = require('../app/controllers/contact');
const informationController = require('../app/controllers/information');
const ordersController = require('../app/controllers/order');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/pages/index', {path: '/'});
})

    .get('/orders', cdController.getAllCities, ordersController.getList, ordersController.responseOrdersTable)
    .put('/orders/:type/:_id', ordersController.editOne, ordersController.responseJson)
    .get('/orders/create', cdController.getAllCities, (req, res) => res.render('admin/pages/orders/order-form', {path: '/orders/create'}))
    .post('/orders/create', productController.setSelectedProductCodeArrayFromCart,
        productController.getProductByCodesArray,
        orderController.validate, orderController.insertOne,
        (req, res) => {
            if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
                res.render('admin/pages/orders/order-form', {
                    path: '/orders/create',
                });
            } else {
                res.render('index', {
                    link: '/manager/orders/create'
                });
            }
        });

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
    }));

module.exports = router;