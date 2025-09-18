const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        authorization: {
            type: String,
            required: true
        },
        conciliated: {
            type: Boolean,
            default: false
        },
        currency: {
            type: String,
            required: true,
            default: 'MXN',
            uppercase: true,
            trim: true,
            maxlength: 3
        },
        creation_date: {
            type: Date,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        error_message: {
            type: String,
        },
        gateway_card_present: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        operation_date:{
            type: Date,
            required: true
        },
        operation_type: {
            type: String,
            required: true
        },
        order_id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
            required: true
        },
        transaction_type: {
            type: String,
        },
        sale_id: {
            type: String,
            required: true
        },
        customer_id: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const Charge = mongoose.model('Charge', chargeSchema);

module.exports = Charge;