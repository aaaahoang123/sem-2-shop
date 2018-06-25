const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product');
router
    .post('/products',productsController.validate, productsController.insertOne, productsController.responseProductJson)
    .put('/products/:code', productsController.validate, productsController.editOne,productsController.responseProductJson)
    .delete('/products/:code', productsController.deleteOne, productsController.responseProductJson);

module.exports = router;