const express = require('express');
const router = express.Router({});

const accountController = require('../app/controllers/account');
const credentialController = require('../app/controllers/credential');

/* GET users listing. */
router.use('/dashboard', credentialController.setTokenFromCookie, credentialController.checkCredential, credentialController.checkAdminEmployeeCredential, credentialController.acceptPermissionAfterCheck);
router.use('/dashboard', require('./dashboard'));
router.get('/', function (req, res) {
    res.render('admin/pages/sign-in');
})
    .post('/', accountController.getOne, accountController.comparePassword, credentialController.insertOne, function (req, res) {
        if (req.errs) {
            res.render('admin/pages/sign-in', {errs: req.errs, account: req.body});
            return;
        }
        console.log(req.credential);
        res.cookie('token', req.credential.token);
        res.render('index', {
            title: 'Login success',
            detail: 'Welcome to our product',
            link: '/manager/dashboard'
        });
    })
;
module.exports = router;
