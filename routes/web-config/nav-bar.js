'use strict';

const router = require('express').Router({});
const navController = require('../../app/controllers/nav-bar');

router
    .get('/',navController.getNavBar, function (req, res) {
        res.render('admin/pages/web-config/nav-bar', {path: '/web-config/nav-bar'});
    });

module.exports = router;