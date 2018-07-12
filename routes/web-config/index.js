'use strict';

const router = require('express').Router({});

router
    .use('/blogs', require('./blogs'))
    .use('/information', require('./information'))
    .use('/contact', require('./contact'))
    .use('/top-category', require('./top-category'))
    .use('/footer', require('./footer'));

module.exports = router;