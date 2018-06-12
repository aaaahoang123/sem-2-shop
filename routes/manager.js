const express = require('express');
const router = express.Router();

/* GET users listing. */
router.use('/dashboard', require('./dashboard'));
router.get('/', function (req, res) {
    res.render('admin/pages/sign-in');
});
module.exports = router;
