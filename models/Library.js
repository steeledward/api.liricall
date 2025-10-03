const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  lyric: { type: String, required: false },
  // Add other fields as needed, set required: true if needed
},
  { timestamps: true }
);

const Library = mongoose.model('Library', librarySchema);

module.exports = Library;