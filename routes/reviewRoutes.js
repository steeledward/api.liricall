const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const reviewController = require('../controllers/reviewController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid reviews ID' });
  }
  next();
}

// Validation and sanitization for reviews creation and update
const reviewValidation = [
  body('content').optional().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active reviewss
router.get('/', reviewController.getActiveReviews);

// Get paged reviews
router.get('/paged', reviewController.getPagedReviews);

// Create a new reviews
router.post('/', reviewValidation, reviewController.createReview);

// Update a reviews by ID
router.put('/:id', validateObjectId, reviewValidation, reviewController.updateReview);

// Delete a reviews by ID
router.delete('/:id', validateObjectId, reviewController.deleteReview);

module.exports = router;