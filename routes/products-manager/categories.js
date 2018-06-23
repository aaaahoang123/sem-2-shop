'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/categories');

router
    .get('/create',controller.findByLevel, controller.responseFormView)
    .post('/', controller.validate, controller.insertOne, controller.responseFormView)

module.exports = router;
