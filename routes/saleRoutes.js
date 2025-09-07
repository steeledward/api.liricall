const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Get all sales
router.get('/', saleController.getAllSales);

// Get a sale by ID
router.get('/:id', saleController.getSaleById);

// Create a new sale
router.post('/', saleController.createSale);

// Update a sale by ID
router.put('/:id', saleController.updateSale);

// Delete a sale by ID
router.delete('/:id', saleController.deleteSale);

module.exports = router;