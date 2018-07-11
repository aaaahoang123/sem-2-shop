'use strict';

const mongoose = require('mongoose');

const modelC = mongoose.model('cities', new mongoose.Schema({
    Title: String,
    ID: Number
}));

const modelD = mongoose.model('districts', new mongoose.Schema({
    Title: String,
    TinhThanhID: Number,
    ID: Number
}));

module.exports = {
    getListCities: function (req, res, next) {
        modelC.find({}, function (err, result) {
            if (err) {
                console.log(err);
                next();
                return;
            }
            res.locals.cities = result;
            next();
        });
    },

    getListDistricts: function (req, res, next) {
        let cid = -1;
        if (req.params.cid) cid = Number(req.params.cid);
        if (req.query.cid) cid = Number(req.query.cid);
        if (cid !== -1) {
            modelD.find({TinhThanhID: cid}, function (err, result) {
                if (err) {
                    console.log(err);
                    next();
                    return;
                }
                res.locals.districts = result;
                next();
            });
        }
        else next();
    }
};