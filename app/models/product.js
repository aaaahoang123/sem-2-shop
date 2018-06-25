'use strict';
const mongoose = require('mongoose');

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
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    specifications: Object,

    // updated_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },

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
        default: 1
    },
});

module.exports = mongoose.model('products', schema);