'use strict';

const router = require('express').Router({});
const contactController = require('../../app/controllers/contact');

router
    .get('/', contactController.getContact, (req, res) => res.render('admin/pages/web-config/contact', {path:'/web-config/contact'}))

    .post('/',contactController.insert, contactController.responseContactFormView);

module.exports = router;
