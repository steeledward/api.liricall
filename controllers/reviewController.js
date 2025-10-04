const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// Get all active reviews
exports.getActiveReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
};

// Get paged reviews
exports.getPagedReviews = async (req, res) => {
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
    const total = await Review.countDocuments(query);

    // Get reviews with pagination and sorting
    const reviews = await Review.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      reviews,
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
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = new Review(req.body);
    await pkg.save();
    res.status(201).json({ message: 'Review created successfully', referer: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create referer', details: err.message });
  }
};

// Update a referer by ID
exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const pkg = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review updated successfully', referer: pkg });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update referer', details: err.message });
  }
};

// Delete a referer by ID
exports.deleteReview = async (req, res) => {
  try {
    const pkg = await Review.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete referer', details: err.message });
  }
};