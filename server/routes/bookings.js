const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { auth, checkRole } = require('../middleware/auth');

// Get all bookings (filtered by role)
router.get('/', auth, async(req, res) => {
    try {
        let query = {};

        // Filter bookings based on user role
        if (req.user.role === 'client') {
            query.client = req.user._id;
        } else if (req.user.role === 'agency') {
            query.agency = req.user._id;
        }
        // Admin can see all bookings

        const bookings = await Booking.find(query)
            .populate('package')
            .populate('client', 'name email')
            .populate('agency', 'name email');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Get booking by ID
router.get('/:id', auth, async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('package')
            .populate('client', 'name email')
            .populate('agency', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user has permission to view this booking
        if (req.user.role === 'client' && booking.client._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }
        if (req.user.role === 'agency' && booking.agency._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
});

// Create new booking (client only)
router.post('/', auth, checkRole(['client']), async(req, res) => {
    try {
        const { packageId, startDate, endDate, numberOfPeople } = req.body;

        // Get package details
        const package = await Package.findById(packageId);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Calculate total price
        const totalPrice = package.price * numberOfPeople;

        const booking = new Booking({
            package: packageId,
            client: req.user._id,
            agency: package.agency,
            startDate,
            endDate,
            numberOfPeople,
            totalPrice
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Update booking status (agency only)
router.put('/:id/status', auth, checkRole(['agency', 'admin']), async(req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is the agency that owns the booking or admin
        if (booking.agency.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
});

// Update payment status (agency only)
router.put('/:id/payment', auth, checkRole(['agency', 'admin']), async(req, res) => {
    try {
        const { paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is the agency that owns the booking or admin
        if (booking.agency.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.paymentStatus = paymentStatus;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
});

module.exports = router;