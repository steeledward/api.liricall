const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Charge = require('../models/Charge');
const Credit = require('../models/Credit');
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

// Create a new sale (with customer check/create by email/phone_number)
exports.createSale = async (req, res) => {
  const { customer, chargeData } = req.body;
  let customerId = null;

  try {
    // First check if email is registered yet
    if (customer && customer.email) {
      let existingCustomer = await Customer.findOne({ email: customer.email });
      if (!existingCustomer) {
        existingCustomer = new Customer(customer);
        await existingCustomer.save();
      }
      customerId = existingCustomer._id;
    } else if (customer && customer.phone_number) {
      let existingCustomer = await Customer.findOne({ phone_number: customer.phone_number });
      if (!existingCustomer) {
        existingCustomer = new Customer(customer);
        await existingCustomer.save();
      }
      customerId = existingCustomer._id;
    } else {
      return res.status(400).json({ error: 'La información del cliente es requerida' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Error al crear al Usuario', details: err.message });
  }

  let chargeReuest = null;
  let newSale = null;

  try {
    // Register the new Sale, is neccesary create in local to pass the ID to the new Openpay Charge
    newSale = new Sale({
      ...chargeData,
      customer: customerId
    });
    await newSale.save();

    chargeReuest = {
      source_id: chargeData.source_id,
      method: 'card',
      amount: chargeData.amount,
      currency: 'MXN',
      description: chargeData.description,
      order_id: newSale._id.toString(),
      device_session_id: chargeData.device_session_id,
      customer: {
        name: customer.name,
        last_name: customer.last_name,
        phone_number: customer.phone_number,
        email: customer.email,
      }
    };

  } catch (err) {
    res.status(400).json({ error: 'Error al crear la venta', details: err.message });
  }

  const chargeResponse = openpay.charges.create(chargeReuest, async (error, charge) => {
    if (error) {
      res.status(201).json({ message: 'Venta creada pago rechazado', paymentError: error });
    } else {
      let newCharge = null;
      try {
        // Register the new Charge
        newCharge = new Charge({
          ...charge,
          sale_id: newSale._id.toString(),
          customer_id: customerId.toString(),
          quantity: chargeData.quantity,
        });
        await newCharge.save();

      } catch (err) {
        res.status(400).json({ error: 'Error al crear el cargo', details: err.message });
      }

      let newCredits = null;
      try {
        // Register the credits from the Charge Data
        let credits = [];
        for (let i = 0; i < chargeData.quantity; i++) {
          credits.push(
            {
              sale_id: newCharge.id,
              quantity: 1,
              used: false,
              library_id: ''
            }
          );
        }

        newCredits = await Credit.insertMany(credits, {
          ordered: false, // Continue inserting even if some documents fail
        });

      } catch (err) {
        res.status(400).json({ error: 'Error al crear los créditos', details: err.message });
      }

      res.status(201).json({ message: 'Venta creada exitósamente', charge, sale: newSale, charge: newCharge, credits: newCredits });
    }
  });
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