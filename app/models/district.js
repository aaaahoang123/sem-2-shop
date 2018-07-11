'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    "Type": Number,
    "SolrID": String,
    "ID": Number,
    "Title": String,
    "STT": Number,
    "TinhThanhID": Number,
    "TinhThanhTitle": String,
    "TinhThanhTitleAscii": String,
    "Created": String,
    "Updated": String
});

module.exports = mongoose.model('district', schema);