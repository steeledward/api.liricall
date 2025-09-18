const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  sale_id: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  used: { type: Boolean, required: true, default: false },
  library_id: { type: String, required: false },
  // Add other fields as needed, set required: true if needed
},
  { timestamps: true }
);

const Credit = mongoose.model('Credit', creditSchema);

module.exports = Credit;