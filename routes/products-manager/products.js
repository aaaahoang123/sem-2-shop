'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/product');
const brandsController= require('../../app/controllers/brand');
const categoriesController = require('../../app/controllers/category');
const carouselController = require('../../app/controllers/carousel');
router
    .get('/', controller.getList, carouselController.getCarousel, controller.productView)
    .get('/create',brandsController.getAll, categoriesController.getListGroup, controller.responseProductFormView)
    .get('/:code', controller.getOne, controller.productView)
    .get('/:code/edit', controller.getOne, brandsController.getAll, categoriesController.getListGroup, controller.responseEditFormView);

module.exports = router;