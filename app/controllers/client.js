'use strict';

module.exports = {
    renderHomePage: (req, res, next) => {
        res.render('client/pages/index', {categories: req.categories});
    }
};