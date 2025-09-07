const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const customerController = require('../controllers/customerController');

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }
  next();
}

// Validation and sanitization for customer creation and update
const customerValidation = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().trim(),
  body('address').optional().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get a customer by ID
router.get('/:id', validateObjectId, customerController.getCustomerById);

// Create a new customer
router.post('/', customerValidation, customerController.createCustomer);

// Update a customer by ID
router.put('/:id', validateObjectId, customerValidation, customerController.updateCustomer);

// Delete a customer by ID
router.delete('/:id', validateObjectId, customerController.deleteCustomer);

module.exports = router;