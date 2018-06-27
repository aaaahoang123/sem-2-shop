'use strict';

const router = require('express').Router({});
const categoryController = require('../../app/controllers/category');

router
    .get('/', categoryController.getList, categoryController.responseCategoryView)
    .get('/create', categoryController.setLimitO, categoryController.setParentLevel, categoryController.getList, categoryController.responseFormView)
    .post('/', categoryController.validate, categoryController.insertOne,categoryController.updateParent, categoryController.responseInsertOneByFormView)
    .get('/:name/edit', categoryController.getOne, categoryController.responseCategoryEditFormView)
    .put('/:name', categoryController.validate, categoryController.editOne, categoryController.responseUpdateByEditFormView)
    // .post('/', categoryController.validate, categoryController.insertOne, categoryController.responseCategoryFormView)
    .delete('/:name', categoryController.deleteOne, categoryController.updateParent, categoryController.responseJson);

module.exports = router;
