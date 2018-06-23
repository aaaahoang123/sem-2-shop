'use strict';

const router = require('express').Router({});

router
    .use('/brands', require('./brands'))
    .use('/categories', require('./categories'))
    .use('/products', require('./products'));

module.exports = router;