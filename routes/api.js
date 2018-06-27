const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product');
const categoriesController = require('../app/controllers/category');

router
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