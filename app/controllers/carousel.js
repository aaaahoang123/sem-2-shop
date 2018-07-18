'use strict';

const fs = require('fs');
const rs = require('../resource/web-config');
module.exports = {
    insert: function (req, res, next) {
        if (!rs.carousel) rs.carousel = [];
        rs.carousel.push(JSON.parse(req.body.data));
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

    delete: function (req, res, next) {
        let arr = [];
        for(let i=0; i<rs.carousel.length; i++){
            if (rs.carousel[i] !== JSON.parse(req.body.data)) arr.push(rs.carousel[i])
        }
        rs.carousel = arr;
        fs.writeFile('app/resource/web-config.json', JSON.stringify(rs, null, 2), 'utf8', (err) =>{
            if(err){
                console.log(err);
                if (!res.locals.errs) res.locals.errs = {};
                res.locals.errs.database = 'Lỗi database';
                return next();
            }
            console.log('delete success');
            res.json(JSON.parse(req.body.data));
        })
    },

    getCarousel: function(req, res, next) {
        if(!rs.carousel) rs.carousel = [];
        res.locals.carousel = rs.carousel;
        next();
    }
};