const express = require('express');
const router = express.Router();

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
});

router.use('/web-config', express.Router()
    .get('/information', informationController.getInformation, function (req, res, next) {
        res.render('admin/pages/web-config/information', {path:'/web-config/information'});
    }).get('/top-category', categoriesController.getListGroup, topCategoriesController.getTopCategories, function (req, res, next) {
        res.render('admin/pages/web-config/top-category', {path:'/web-config/top-category',
            categories: (req.categories && req.categories.length !== 0)?req.categories:[]
        });
    }).get('/contact', contactController.getContact, function (req, res, next) {
        res.render('admin/pages/web-config/contact', {path:'/web-config/contact'});
    })

    .post('/top-category',topCategoriesController.insert, topCategoriesController.responseTopCategoriesFormView)
    .post('/contact',contactController.insert, contactController.responseContactFormView)
    .post('/information',informationController.insert, informationController.responseInformationFormView)
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