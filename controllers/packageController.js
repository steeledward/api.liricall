const Package = require('../models/Package');
const { validationResult } = require('express-validator');

// Get all active packages
exports.getActivePackages = async (req, res) => {
  try {
    const packages = await Package.find({ active: true });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages', details: err.message });
  }
};

// Create a new package
exports.createPackage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.status(201).json({ message: 'Package created successfully', package: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create package', details: err.message });
  }
};

// Update a package by ID
exports.updatePackage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json({ message: 'Package updated successfully', package: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update package', details: err.message });
  }
};

// Delete a package by ID
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete package', details: err.message });
  }
};