'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    expired_at: {
        type: Date,
        required: true,
        default: +new Date() + 7*24*60*60*1000
    },
    status: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('credentials', schema);