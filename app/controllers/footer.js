'use strict';

const webConfig = require('../resource/web-config');

module.exports = {

    getFooterBlog: function(req, res, next) {
        if(!webConfig.footer) webConfig.footer = [];
        res.locals.footer = webConfig.footer;
        next();
    },
};