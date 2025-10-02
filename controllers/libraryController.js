const Library = require('../models/Library');
const Credit = require('../models/Credit');
const { validationResult } = require('express-validator');

// Get all active libraries
exports.getActiveLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch libraries', details: err.message });
  }
};

// Get paged libraries
exports.getPagedLibraries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'Date';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { Title: { $regex: search, $options: 'i' } },
          { Story: { $regex: search, $options: 'i' } },
          { Lyric: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const total = await Library.countDocuments(query);

    // Get libraries with pagination and sorting
    const libraries = await Library.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      libraries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server Error' });
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
      res.status(400).json({ error: 'Id de la venta no encontrado', details: 'request: ' + req.body });
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