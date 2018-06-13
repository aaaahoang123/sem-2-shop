var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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

module.exports = router;
