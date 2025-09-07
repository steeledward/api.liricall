const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Charge = require('../models/Charge');
const Openpay = require('openpay');

//instantiation
let openpay = new Openpay(process.env.OPENPAY_ID, process.env.OPENPAY_PRIVATE_KEY);

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('customer');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales', details: err.message });
  }
};

// Get a sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('customer');
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch sale', details: err.message });
  }
};

// Create a new sale (with customer check/create by email)
exports.createSale = async (req, res) => {
  try {
    const { customer, chargeData } = req.body;
    let customerId;

    if (customer && customer.email) {
      let existingCustomer = await Customer.findOne({ email: customer.email });
      if (!existingCustomer) {
        existingCustomer = new Customer(customer);
        await existingCustomer.save();
      }
      customerId = existingCustomer._id;
    } else if (customer && customer._id) {
      customerId = customer._id;
    } else {
      return res.status(400).json({ error: 'Customer information is required' });
    }

    const sale = new Sale({
      ...chargeData,
      customer: customerId
    });
    await sale.save();

    const chargeReuest = {
      source_id: chargeData.source_id,
      method: 'card',
      amount: chargeData.amount,
      currency: 'MXN',
      description: chargeData.description,
      order_id: sale._id.toString(),
      device_session_id: chargeData.device_session_id,
      customer: {
        name: customer.name,
        last_name: customer.last_name,
        phone_number: customer.phone_number,
        email: customer.email,        
      }
    };

    const chargeResponse = openpay.charges.create(chargeReuest, async (error, charge) => {
      if (error) {
        res.status(201).json({  message: 'Sale created but payment failed', sale, paymentError: error  });
      } else {
        const newCharge = new Charge({
          ...charge,
          sale_id: sale._id.toString(),
          customer_id: customerId.toString(),
        });
        await newCharge.save();
        
        res.status(201).json({  message: 'Sale created successfully', charge, sale, newCharge  });
      }
    });

  } catch (err) {
    res.status(400).json({ error: 'Failed to create sale', details: err.message });
  }
};

// Update a sale by ID
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json({ message: 'Sale updated successfully', sale });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update sale', details: err.message });
  }
};

// Delete a sale by ID
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete sale', details: err.message });
  }
};