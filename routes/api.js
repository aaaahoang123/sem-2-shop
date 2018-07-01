const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product'),
    categoriesController = require('../app/controllers/category'),
    cdController = require('../app/controllers/city-and-district');
router
    .get('/products', productsController.getList,
        (req, res) => {
            if (res.locals.errs || res.locals.products.length === 0) {
                res.status(404);
                res.json({
                    "errors": [
                        {
                            "status": "404",
                            "title":  "Not found",
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
        if (res.locals.errs) {
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
        if (res.locals.errs) {
            res.status(404);
            res.json({
                error: 404,
                detail: 'Cannot find district'
            });
            return;
        }
        res.json(res.locals.cities);
    });
module.exports = router;