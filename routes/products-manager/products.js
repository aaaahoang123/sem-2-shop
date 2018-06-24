'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/product');
const controllerBrands = require('../../app/controllers/brand');
router
    .get('/', controller.getList, controller.productView)
    .get('/create',controllerBrands.getList, controller.responseProductFormView)
    .get('/:code', controller.getOne, controller.productView)
    .get('/:code/edit', controller.getOne, controllerBrands.getList, controller.responseEditFormView);

module.exports = router;