const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product');
router.post('/products',productsController.validate, productsController.insertOne, productsController.responseProductJson);

module.exports = router;