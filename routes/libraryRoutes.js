const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const libraryController = require('../controllers/libraryController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid library ID' });
  }
  next();
}

// Validation and sanitization for library creation and update
const libraryValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('story').isString().trim().notEmpty().withMessage('Story is required'),
  body('description').isString().trim().notEmpty().withMessage('Description is required'),
  body('contact').isString().trim().notEmpty().withMessage('Contact is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active librarys
router.get('/', libraryController.getActiveLibraries);

// Create a new library
router.post('/', libraryValidation, libraryController.createLibrary);

// Update a library by ID
router.put('/:id', validateObjectId, libraryValidation, libraryController.updateLibrary);

// Delete a library by ID
router.delete('/:id', validateObjectId, libraryController.deleteLibrary);

module.exports = router;