const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/product');
router.post('/products',productsController.checkNull, productsController.insertOne);

module.exports = router;