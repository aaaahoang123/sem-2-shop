'use strict';

const fs = require('fs');
const rs = require('../resource/web-config');
module.exports = {
    insert: function (req, res, next) {
        rs.nav_bar = JSON.parse(req.body.data);
        fs.writeFile('app/resource/web-config.json', JSON.stringify(rs, null, 2), 'utf8', (err) =>{
            if(err){
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = 'Lỗi database';
                return next();
            }
            console.log('write success');
            res.json(JSON.parse(req.body.data));
        })
    },

    getNavBar: function(req, res, next) {
        if(!rs.nav_bar) rs.nav_bar = [];
        res.locals.nav_bar = rs.nav_bar;
        next();
    }
};