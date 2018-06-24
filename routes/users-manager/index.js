'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/user');
const accountController = require('../../app/controllers/account');

router
    .get('/users', controller.getList, controller.responseUsersView)
    .get('/users/create', controller.responseUsersFormView)
    .get('/users/:mid/account', controller.getOne, accountController.responseAccountFormView)
    .get('/users/:mid', controller.getOne, controller.responseUserWithAccountView)

    //.put('/users/:mid', controller.validate, controller.updateOne, controller.responseUserUpdateView)
    //.put('/users/:mid/account', accountController.validate, controller.getOne, accountController.responseAccountUpdateView)

    .post('/users/:mid/account', accountController.validate, accountController.insertOne, controller.getOne, accountController.responseAccountFormView)
    .post('/users/create', controller.validate, controller.insertOne, controller.responseUsersFormView)




module.exports = router;