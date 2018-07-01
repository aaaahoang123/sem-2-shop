const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product');
const categoriesController = require('../app/controllers/category');

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
    .delete('/products/:code', productsController.deleteOne, productsController.responseProductJson);

module.exports = router;