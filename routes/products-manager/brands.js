'use strict';

const router = require('express').Router({});
const brandController = require('../../app/controllers/brand');

router
    .get('/', brandController.getList, brandController.responseBrandView)
    .get('/create', brandController.responseBrandFormView)
    .get('/:name/edit', brandController.getOne, brandController.responseBrandEditFormView)
    .put('/:name', brandController.validate, brandController.editOne, brandController.responseBrandEditFormView)
    .post('/', brandController.validate, brandController.insertOne, brandController.responseBrandFormView)
    .delete('/:name', brandController.deleteOne, brandController.responseJson);

module.exports = router;