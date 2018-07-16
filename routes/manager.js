const express = require('express');
const router = express.Router({});

const accountController = require('../app/controllers/account'),
    credentialController = require('../app/controllers/credential'),
    cdController = require('../app/controllers/city-and-district'),
    productController = require('../app/controllers/product'),
    orderController = require('../app/controllers/order');

/* GET users listing. */
router
    .get('/', (req, res) => {
        res.render('admin/pages/sign-in');
    })
    .post('/', accountController.getOne, accountController.comparePassword, credentialController.insertOne, (req, res) => {
        console.log(res.locals);
        if (res.locals.errs) {
            res.render('admin/pages/sign-in', {account: req.body});
            return;
        }
        res.cookie('token', res.locals.credential.token);
        res.render('index', {
            title: 'Login success',
            detail: 'Welcome to our product',
            link: '/manager/dashboard'
        });
    })

    .use(credentialController.setTokenFromCookie, credentialController.checkCredential, credentialController.checkAdminEmployeeCredential, credentialController.acceptPermissionAfterCheck)
    /* GET users listing. */
    router.get('/dashboard', function (req, res, next) {
        res.render('admin/pages/index', {path: '/'});
    })

    .get('/orders', cdController.getAllCities, orderController.getList, orderController.responseOrdersTable)
    .put('/orders/:type/:_id', orderController.editOne, orderController.responseJson)
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
