'use strict';

const router = require('express').Router({});
const blogController = require('../../app/controllers/blog');

router
    .get('/create', (req, res) => res.render('admin/pages/web-config/blogs-form', {path:'/web-config/add-blog', title: 'ADD BLOG'}))
    .get('/', blogController.getList, blogController.responseBrandTable)
    .get('/:uri_title/edit', blogController.getOne, blogController.responseBlogEditForm)

    .post('/', blogController.validate, blogController.insertOne, blogController.responseInsertOneByBlogFormView)

    .put('/:uri_title', blogController.validate, blogController.editOne, blogController.responseEditByBlogForm)

    .delete('/:uri_title', blogController.deleteOne, blogController.responseJson);

module.exports = router;