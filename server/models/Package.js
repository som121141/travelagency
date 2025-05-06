const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    features: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;