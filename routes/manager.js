const express = require('express');
const router = express.Router();

/* GET users listing. */
router.use('/dashboard', require('./dashboard'));

module.exports = router;
