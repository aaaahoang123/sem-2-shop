'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/user');
const accountController = require('../../app/controllers/account');

router
    .get('/users', controller.getList, controller.responseUsersView)
    .get('/users/create', (req, res) => res.render('admin/pages/users-manager/add-user-form', {path: '/users-manager/users/create'}))
    .get('/users/:mid/account', controller.getOne, (req, res) => res.render('admin/pages/users-manager/accounts-form', {path: '/users-manager/users'}))
    .get('/users/:mid', controller.getOne, controller.responseUserWithAccountView)

    .put('/users/:mid', controller.validate, controller.updateOne, controller.responseUpdateByUAView)
    .put('/users/account/:username', accountController.validate, accountController.getOne, accountController.updateOne, accountController.responseUpdateByUAView)

    .post('/users/:mid/account', accountController.validate, accountController.insertOne, accountController.responseInsertOneByAccountFormView)
    .post('/users/create', controller.validate, controller.insertOne, controller.responseInsertOneByUsersFormView)

    .delete('/users', controller.deleteMulti, accountController.deleteMulti, controller.deleteMulti, accountController.responseDeleteJson)
    .delete('/users/:mid', controller.deleteOne, accountController.deleteOne, controller.deleteOne, accountController.responseDeleteJson)

module.exports = router;