const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  description: { type: String, required: true },
  contact: { type: String, required: true },
  // Add other fields as needed, set required: true if needed
},
  { timestamps: true }
);

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;