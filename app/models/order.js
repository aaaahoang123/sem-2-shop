'use strict';

const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    products: [{
        _id: mongoose.Schema.Types.ObjectId,
        price: Number,
        quantity: Number
    }],
    receiver_address: {
        type: String,
        required: true
    },
    receiver_city: {
        type: Number,
        required: true
    },
    receiver_district: {
        type: Number,
        required: true
    },
    receiver_phone: {
        type: String,
        required: true
    },
    receiver_email: {
        type: String,
        required: true
    },
    total: Number,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts'
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
        enum: [-1, 0, 1, 2],
        default: 0
    }
});

module.exports = mongoose.model('orders', schema);