'use strict';

const router = require('express').Router({});
const controller = require('../../app/controllers/footer');
router
    .get('/', controller.getFooterBlog, (req, res) => res.render('admin/pages/web-config/footer', {path: '/web-config/footer'}));

module.exports = router;