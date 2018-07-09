'use strict';

const router = require('express').Router({});
const informationController = require('../../app/controllers/information');

router
    .get('/', informationController.getInformation,
        (req, res) => res.render('admin/pages/web-config/information', {path:'/web-config/information'}))

    .post('/',informationController.insert, informationController.responseInformationFormView);

module.exports = router;