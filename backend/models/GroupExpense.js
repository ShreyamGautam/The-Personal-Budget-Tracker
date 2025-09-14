const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupExpenseSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    splits: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('GroupExpense', groupExpenseSchema);