'use strict';

const city = require('../models/city'),
    district = require('../models/district');

module.exports = {
    getAllCities: (req, res, next) => {
        city.find({}, (err, result) => {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                console.log(err);
                return next();
            }
            res.locals.cities = result;
            next();
        });
    },

    getDistrictOfCity: (req, res, next) => {
        let cityId = 3;
        if (req.params.cid) cityId = req.params.cid;
        if (req.query.cid) cityId = req.query.cid;
        if (req.body.cid) cityId = req.body.cid;
        district.find({TinhThanhID: cityId}, (err, result) => {
            if (err) {
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = err.message;
                console.log(err);
                return next();
            }
            res.locals.districts = result;
            next();
        })
    }
};