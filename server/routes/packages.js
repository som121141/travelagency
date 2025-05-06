const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { auth, checkRole } = require('../middleware/auth');

// Get all packages
router.get('/', async(req, res) => {
    try {
        const packages = await Package.find({ isActive: true })
            .populate('agency', 'name email');
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error: error.message });
    }
});

// Get package by ID
router.get('/:id', async(req, res) => {
    try {
        const package = await Package.findById(req.params.id)
            .populate('agency', 'name email');
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(package);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching package', error: error.message });
    }
});

// Create new package (agency only)
router.post('/', auth, checkRole(['agency', 'admin']), async(req, res) => {
    try {
        console.log('Received package data:', req.body);

        // Parse features from JSON string
        let features = [];
        try {
            features = JSON.parse(req.body.features);
        } catch (error) {
            console.error('Error parsing features:', error);
            features = [];
        }

        const package = new Package({
            title: req.body.title,
            description: req.body.description,
            destination: req.body.destination,
            duration: Number(req.body.duration),
            price: Number(req.body.price),
            features: features,
            isActive: req.body.isActive === 'true',
            agency: req.user._id
        });

        console.log('Creating package with data:', package);
        await package.save();
        res.status(201).json(package);
    } catch (error) {
        console.error('Package creation error:', error);
        res.status(500).json({ message: 'Error creating package', error: error.message });
    }
});

// Update package (agency only)
router.put('/:id', auth, checkRole(['agency', 'admin']), async(req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Check if user is the agency that created the package or admin
        if (package.agency.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this package' });
        }

        Object.assign(package, req.body);
        await package.save();
        res.json(package);
    } catch (error) {
        res.status(500).json({ message: 'Error updating package', error: error.message });
    }
});

// Delete package (agency only)
router.delete('/:id', auth, checkRole(['agency', 'admin']), async(req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Check if user is the agency that created the package or admin
        if (package.agency.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this package' });
        }

        // Soft delete by setting isActive to false
        package.isActive = false;
        await package.save();
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting package', error: error.message });
    }
});

module.exports = router;