const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  package: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  active: { type: Boolean, required: true, default: true },
  // Add other fields as needed, set required: true if needed
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;