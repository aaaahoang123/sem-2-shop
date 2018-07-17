'use strict';

const fs = require('fs');
const rs = require('../resource/web-config');
module.exports = {
    insert: function (req, res, next) {
        rs.information = req.body;
        fs.writeFile('app/resource/web-config.json', JSON.stringify(rs, null, 2), 'utf8', (err) =>{
            if(err){
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = 'Lỗi database';
                return next();
            }
            console.log('write success');
            res.locals = {
                title: "Success",
                detail: "Config Information Success",
                link: "/manager/web-config/information"
            };
            next();
        })
    },

    getInformation: function(req, res, next) {
        if(!rs.information) rs.information = {};
        res.locals.information = rs.information;
        next();
    },

    responseInformationFormView: function (req, res) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/web-config/information', {
                path: '/web-config/information',
                information: req.body,
            });
        } else {
            res.redirect('/manager/web-config/information?message=config-success');
        }
    }
};