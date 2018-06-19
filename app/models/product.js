'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

let schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    specifications: Object,
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('products', schema);