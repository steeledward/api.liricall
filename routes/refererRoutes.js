const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const refererController = require('../controllers/refererController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid referers ID' });
  }
  next();
}

// Validation and sanitization for referers creation and update
const refererValidation = [
  body('content').optional().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active refererss
router.get('/', refererController.getActiveReferers);

// Create a new referers
router.post('/', refererValidation, refererController.createReferer);

// Update a referers by ID
router.put('/:id', validateObjectId, refererValidation, refererController.updateReferer);

// Delete a referers by ID
router.delete('/:id', validateObjectId, refererController.deleteReferer);

module.exports = router;