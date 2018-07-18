'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/footer');
const blogController = require('../../app/controllers/blog');
router
    .get('/',(req, res, next) => {
    req.query.limit = '50';
    next();
}, blogController.getList,
        controller.getFooterBlog,
        (req, res) => res.render('admin/pages/web-config/footer', {path: '/web-config/footer'}));

module.exports = router;