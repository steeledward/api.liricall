const Referer = require('../models/Referer');
const { validationResult } = require('express-validator');

// Get all active referers
exports.getActiveReferers = async (req, res) => {
  try {
    const referers = await Referer.find({});
    res.json(referers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch referers', details: err.message });
  }
};

// Create a new referer
exports.createReferer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = new Referer(req.body);
    await pkg.save();
    res.status(201).json({ message: 'Referer created successfully', referer: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create referer', details: err.message });
  }
};

// Update a referer by ID
exports.updateReferer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = await Referer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ error: 'Referer not found' });
    res.json({ message: 'Referer updated successfully', referer: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update referer', details: err.message });
  }
};

// Delete a referer by ID
exports.deleteReferer = async (req, res) => {
  try {
    const pkg = await Referer.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Referer not found' });
    res.json({ message: 'Referer deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete referer', details: err.message });
  }
};