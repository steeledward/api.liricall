const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const packageController = require('../controllers/packageController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid package ID' });
  }
  next();
}

// Validation and sanitization for package creation and update
const packageValidation = [
  body('package').isString().trim().notEmpty().withMessage('Package name is required'),
  body('description').optional().isString().trim(),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('active').isBoolean().withMessage('Active must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active packages
router.get('/', packageController.getActivePackages);

// Create a new package
router.post('/', packageValidation, packageController.createPackage);

// Update a package by ID
router.put('/:id', validateObjectId, packageValidation, packageController.updatePackage);

// Delete a package by ID
router.delete('/:id', validateObjectId, packageController.deletePackage);

module.exports = router;