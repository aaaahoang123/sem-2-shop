const express = require('express');
const router = express.Router({});
const webConfigController = require('../app/controllers/web-config');

/* GET home page. */
router.get('/', webConfigController.getTopCategories, function(req, res, next) {
  res.render('client/pages/index');
});

router.get('/blog', function(req, res, next) {
    res.render('client/pages/blog');
});

router.get('/blog_single', function(req, res, next) {
    res.render('client/pages/blog_single');
});

router.get('/cart', function(req, res, next) {
    res.render('client/pages/cart');
});

router.get('/contact', function(req, res, next) {
    res.render('client/pages/contact');
});

router.get('/product', function(req, res, next) {
    res.render('client/pages/product');
});

router.get('/regular', function(req, res, next) {
    res.render('client/pages/regular');
});

router.get('/shop', function(req, res, next) {
    res.render('client/pages/shop');
});

// router.put('/', function (req, res, next) {
//     console.log('abc');
//     res.send('âcc');
// });

module.exports = router;
