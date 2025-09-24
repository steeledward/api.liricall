const mongoose = require('mongoose');

const refererSchema = new mongoose.Schema({
  content: { type: String, required: true },
  // Add other fields as needed, set required: true if needed
},
  { timestamps: true }
);

const Referer = mongoose.model('Referer', refererSchema);

module.exports = Referer;