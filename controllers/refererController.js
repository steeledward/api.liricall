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

// Get paged referers
exports.getPagedReferers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const total = await Referer.countDocuments(query);

    // Get referers with pagination and sorting
    const referers = await Referer.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      referers,
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