'use strict'

const fs = require('fs');
const rs = require('../resource/web-config');
module.exports = {
    insert: function (req, res, next) {
        rs.top_categories = [];
        for(let key in req.body){
            if(req.body[key] === "" || req.body[key] === null) continue;
            rs.top_categories.push(req.body[key]);
        }
        fs.writeFile('app/resource/web-config.json', JSON.stringify(rs, null, 2), 'utf8', (err) =>{
            if(err){
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = res.locals.message;
                return next();
            }
            res.locals = {
                title: "Success",
                detail: "Config Top-Category Success",
                link: "/manager/dashboard/web-config/top-category"
            };
            console.log('write success');
            next();
        })
    },

    getTopCategories: function(req, res ,next){
        if(!rs.top_categories) rs.top_categories = [];
        res.locals.topCategories = rs.top_categories;
        next();
    },

    responseTopCategoriesFormView: function (req, res) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/web-config/top-category', {
                path: '/web-config/top-category',
                topCategories: req.body,
            });
        } else {
            res.render('index');
        }
    }
};