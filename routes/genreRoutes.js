const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const genreController = require('../controllers/genreController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid genres ID' });
  }
  next();
}

// Validation and sanitization for genres creation and update
const genreValidation = [
  body('content').optional().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active genress
router.get('/', genreController.getActiveGenres);

// Get paged genres
router.get('/paged', genreController.getPagedGenres);

// Create a new genres
router.post('/', genreValidation, genreController.createGenre);

// Update a genres by ID
router.put('/:id', validateObjectId, genreValidation, genreController.updateGenre);

// Delete a genres by ID
router.delete('/:id', validateObjectId, genreController.deleteGenre);

module.exports = router;