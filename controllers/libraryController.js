const Library = require('../models/Library');
const Credit = require('../models/Credit');
const { validationResult } = require('express-validator');

// Get all active libraries
exports.getActiveLibraries = async (req, res) => {
  try {
    const libraries = await Library.find({ active: true });
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch libraries', details: err.message });
  }
};

// Create a new library
exports.createLibrary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create the Library
  try {
    const pkg = new Library(req.body);
    await pkg.save();

    // Update Credits for the new Library
    if (req.body.sale_id) {
      const credit = await Credit.findOneAndUpdate(
        {
          sale_id: req.body.sale_id,
          used: false
        },
        {
          sale_id: req.body.sale_id,
          quantity: 1,
          used: true,
          library_id: pkg._id
        }
      );
    } else {
      res.status(400).json({ error: 'Id de la venta no encontrado', details: 'request: ' + req.body});
    }

    res.status(201).json({ message: 'Library created successfully', library: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create library', details: err.message });
  }
};

// Update a library by ID
exports.updateLibrary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = await Library.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ error: 'Library not found' });
    res.json({ message: 'Library updated successfully', library: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update library', details: err.message });
  }
};

// Delete a library by ID
exports.deleteLibrary = async (req, res) => {
  try {
    const pkg = await Library.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Library not found' });
    res.json({ message: 'Library deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete library', details: err.message });
  }
};