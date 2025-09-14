const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);