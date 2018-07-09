'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    mid: {
        type: String,
        required: true,
        unique: true,
        default: Date.now
    },
    full_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: Number,
        required: true,
        enum: [-1, 1],
        default: 1
    }
});

module.exports = mongoose.model('users', schema);