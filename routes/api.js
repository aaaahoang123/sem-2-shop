const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product');
const categoriesController = require('../app/controllers/category');
const cdController = require('../app/controllers/city-and-district');
const fs = require('fs');
const webConfig = require('../app/resource/web-config');
const navController = require('../app/controllers/nav-bar');
const orderController = require('../app/controllers/order');
const carouselController = require('../app/controllers/carousel');

router
    .get('/products', productsController.getList,
        (req, res) => {
            if (res.locals.errs || res.locals.products.length === 0) {
                res.status(404);
                res.json({
                    "errors": [
                        {
                            "status": "404",
                            "title": "Not found",
                            "detail": "Not found any products"
                        }
                    ]
                });
                return;
            }
            res.status(200);
            res.json(res.locals.products);
        })

    .post('/products', productsController.validate,
        categoriesController.getMultiCategories,
        productsController.filterCategoriesSet,
        productsController.insertOne,
        productsController.responseProductJson)

    .put('/products/:code', productsController.validate,
        categoriesController.getMultiCategories,
        productsController.filterCategoriesSet,
        productsController.editOne,
        productsController.responseProductJson)

    .delete('/products/:code', productsController.deleteOne, productsController.responseProductJson)

    .get('/cities', cdController.getAllCities, (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json({
                error: 404,
                detail: 'Cannot find cities'
            });
            return;
        }
        res.json(res.locals.cities);
    })

    .get('/districts', cdController.getDistrictOfCity, (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json({
                error: 404,
                detail: 'Cannot find district'
            });
            return;
        }
        res.json(res.locals.districts);
    })

    .post('/footer', (req, res) => {
        webConfig.footer = JSON.parse(req.body.footer);
        fs.writeFile('app/resource/web-config.json', JSON.stringify(webConfig, null, 2), 'utf8', (err, result) => {
            if (err) {
                console.log(err);
                res.send(err.message);
            }
            console.log('write success');
            res.send(result);
        });
    })

    .post('/nav-bar', navController.insert)

    .post('/carousel', carouselController.insert)
    .post('/carousel/delete', carouselController.delete)

    .get('/charts', orderController.getAndGroupOrder, (req, res) => {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.status(404);
            res.json({
                error: 404,
                detail: 'Cannot find any thing!'
            });
            return;
        }
        res.json(res.locals.chart_data);
    });

module.exports = router;
