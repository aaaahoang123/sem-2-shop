'use strict';
const mongoose = require('mongoose');

let schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'categories'
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
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('categories', schema);