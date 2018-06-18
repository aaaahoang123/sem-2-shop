'use strict';
const model = require('../models/product');
module.exports = {
    getOne: function (req, res, next) {
        let query = {
            code: req.params.code
        };
        model.find(query, function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            req.products = [
                result
            ];
            next();
        });
    }
};

