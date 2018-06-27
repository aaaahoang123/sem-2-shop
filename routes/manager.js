const express = require('express');
const router = express.Router({});

const accountController = require('../app/controllers/account');
const credentialController = require('../app/controllers/credential');

/* GET users listing. */
router
    .use('/dashboard', credentialController.setTokenFromCookie, credentialController.checkCredential, credentialController.checkAdminEmployeeCredential, credentialController.acceptPermissionAfterCheck)
    .use('/dashboard', require('./dashboard'))
    .get('/', (req, res) => {
        res.render('admin/pages/sign-in');
    })
    .post('/', accountController.getOne, accountController.comparePassword, credentialController.insertOne, (req, res) => {
        if (req.errs) {
            res.render('admin/pages/sign-in', {errs: req.errs, account: req.body});
            return;
        }
        res.cookie('token', req.credential.token);
        res.render('index', {
            title: 'Login success',
            detail: 'Welcome to our product',
            link: '/manager/dashboard'
        });
    })
;
module.exports = router;
