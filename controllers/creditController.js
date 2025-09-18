const Credit = require('../models/Credit');
const { validationResult } = require('express-validator');

// Get all credits
exports.getAllCredits = async (req, res) => {
  try {
    const credits = await Credit.find();
    res.json(credits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch credits', details: err.message });
  }
};

// Get a credit by ID
exports.getCreditById = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ error: 'Credit not found' });
    res.json(credit);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch credit', details: err.message });
  }
};

// Create a new credit
exports.createCredit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const credit = new Credit(req.body);
    await credit.save();
    res.status(201).json({ message: 'Credit created successfully', credit });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create credit', details: err.message });
  }
};

// Update a credit by ID
exports.updateCredit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const credit = await Credit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!credit) return res.status(404).json({ error: 'Credit not found' });
    res.json({ message: 'Credit updated successfully', credit });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update credit', details: err.message });
  }
};

// Delete a credit by ID
exports.deleteCredit = async (req, res) => {
  try {
    const credit = await Credit.findByIdAndDelete(req.params.id);
    if (!credit) return res.status(404).json({ error: 'Credit not found' });
    res.json({ message: 'Credit deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete credit', details: err.message });
  }
};

// Get available credits for a SaleId
exports.getAvailableCredits = async (req, res) => {
  try {
    if (req.params.sale_id) {
      const filters = {
        sale_id: req.params.sale_id,
        used: false
      };

      const result = await Credit.find(filters);

      const sum = result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.quantity;
      }, 0);

      res.json({availables: sum});
    } else {
      res.status(500).json({ error: 'Failed to fetch credits', details: 'Id de la venta invaido' });
    }

    res.status(500).json({ error: 'Failed to fetch credits', details: 'Id de la venta invaido' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch credits', details: err.message });
  }
};