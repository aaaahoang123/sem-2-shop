'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/user');

router
    .get('/users', controller.responseUsersView)
    .get('/users/create', controller.responseUsersFormView)
    .post('/users', controller.validate, controller.insertOne, controller.responseUsersFormView);

module.exports = router;