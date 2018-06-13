const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/layouts/master', {path: '/'});
}).get('/home', function (req, res, next) {
    res.render('admin/pages/home');
}).get('/user', function (req, res, next) {
    res.render('admin/pages/user');
}).use('/website-config', express.Router()
    .get('/information', function (req, res, next) {
        res.render('admin/pages/website-config/contact');
    }));

module.exports = router;