const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const creditController = require('../controllers/creditController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid credit ID' });
  }
  next();
}

// Validation and sanitization for credit creation and update
const creditValidation = [
  body('sale_id').isString().trim().notEmpty().withMessage('Sale Id is required'),
  body('quantity').isString().trim().notEmpty().withMessage('Quantity is required'),
  body('used').isString().trim().notEmpty().withMessage('Used is required'),
  body('library_id').isString().trim().notEmpty().withMessage('Credit Id is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active credits
router.get('/', creditController.getAllCredits);

// Create a new credit
router.post('/', creditValidation, creditController.createCredit);

// Update a credit by ID
router.put('/:id', validateObjectId, creditValidation, creditController.updateCredit);

// Delete a credit by ID
router.delete('/:id', validateObjectId, creditController.deleteCredit);

// Get available credits for Sale Id
router.get('/available/:sale_id', creditController.getAvailableCredits);

module.exports = router;