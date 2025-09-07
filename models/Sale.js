const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  method: { type: String, required: true, default: "Card" },
  source_id: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  device_session_id: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  // Add other fields as needed
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;