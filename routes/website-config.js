const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('admin/layouts/master', {path: '/'});
}).get('/information', function (req, res, next) {
    res.render('admin/pages/website-config/information');
});

module.exports = router;