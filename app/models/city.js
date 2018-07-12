'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    Type: Number,
    SolrID: String,
    ID: Number,
    Title: String,
    STT: Number,
    Created: String,
    Updated: String,
    TotalDoanhNghiep: Number
});

module.exports = mongoose.model('cities', schema);