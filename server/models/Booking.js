const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;