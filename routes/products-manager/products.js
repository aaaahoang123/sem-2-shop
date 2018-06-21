'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/product');

router
    .get('/', controller.getList, controller.productView)
    .get('/create', controller.responseProductFormView)
    .get('/:code', controller.getOne, controller.productView);

module.exports = router;