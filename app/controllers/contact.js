'use strict'

const fs = require('fs');
const rs = require('../resource/web-config');
module.exports = {
    insert: function (req, res, next) {
        rs.contact = req.body;
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
                detail: "Config Contact Success",
                link: "/manager/web-config/contact"
            };
            next();
        })
    },

    getContact: function(req, res, next) {
        if(!rs.contact) rs.contact = {};
        res.locals.contacts = rs.contact;
        next();
    },

    responseContactFormView: function (req, res) {
        if (res.locals.errs && Object.keys(res.locals.errs).length !== 0) {
            res.render('admin/pages/web-config/contact', {
                path: '/web-config/contact',
                contacts: req.body,
            });
        } else {
            res.render('index');
        }
    }
};