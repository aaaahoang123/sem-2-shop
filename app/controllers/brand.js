'use strict';

const model = require('../models/brand');

module.exports = {

    validate: function(req, res, next){
        if(!req.errs) req.errs = [];

        if(!req.body.name || req.body.name === null || req.body.name === '') req.errs.push({
            field: 'name',
            detail: 'Brand name can not be null'
        });

        if(!req.body.description || req.body.description === null || req.body.description === '') req.errs.push({
            field: 'description',
            detail: 'Brand description can not be null'
        });

        if(!req.body.logo || req.body.logo === null || req.body.logo === '') req.errs.push({
            field: 'logo',
            detail: 'Brand logo can not be null'
        });

        next();
    },

    insertOne: function (req, res, next) {
        if(req.errs && req.errs.length !== 0) {
            console.log(req.errs);
            return;
        }

        let brand = new model(req.body);
        brand.save(function (err, result) {
            if(err) {
                console.log(err);
                res.send(err);
                return;
            }
            res.render('index', {
                title: 'Success',
                detail: 'Add brand successfully'
            })
        })
    }
}