const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: Date, required: false },
  library_id: { type: String, required: true },
  user_id: { type: String, required: true },
  review: { type: String, required: true },
  // Add other fields as needed, set required: true if needed
},
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;