'use strict';

const router = require('express').Router({});
const brandController = require('../../app/controllers/brand');

router
    .get('/', brandController.getList, brandController.responseBrandTable)
    .get('/create', (req, res) => res.render('admin/pages/products-manager/brands-form', {path: '/products-manager/add-brand', title: 'ADD BRAND'}))
    .get('/:name/edit', brandController.getOne, brandController.responseBrandEditForm)

    .put('/:name', brandController.validate, brandController.editOne, brandController.responseEditByBrandForm)

    .post('/', brandController.validate, brandController.insertOne, brandController.responseInsertOneByBrandFormView)

    .delete('/:name', brandController.deleteOne, brandController.responseJson);

module.exports = router;