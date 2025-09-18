const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  package: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  active: { type: Boolean, required: true, default: true },
  quantiy: { type: Number, required: true, default: 1 },
  // Add other fields as needed, set required: true if needed
},
  { timestamps: true }
);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;