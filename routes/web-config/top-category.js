'use strict';

const router = require('express').Router({});
const topCategoriesController = require('../../app/controllers/top-categories');
const categoriesController = require('../../app/controllers/category');
router
    .get('/', categoriesController.getListGroup, topCategoriesController.getTopCategories,
        (req, res) => res.render('admin/pages/web-config/top-category', {path:'/web-config/top-category'})
    )

    .post('/',topCategoriesController.insert, topCategoriesController.responseTopCategoriesFormView);

module.exports = router;