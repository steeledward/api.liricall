const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const libraryController = require('../controllers/libraryController');

const multer = require('multer');
const path = require('path');

// Set up Multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Images will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Generate a unique filename by appending a timestamp to the original filename
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware to validate ObjectId
function validateObjectId(req, res, next) {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid library ID' });
  }
  next();
}

// Validation and sanitization for library creation and update
const libraryValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('story').isString().trim().notEmpty().withMessage('Story is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all active librarys
router.get('/', libraryController.getActiveLibraries);

// Get paged librarys
router.get('/paged', libraryController.getPagedLibraries);

// Create a new library
router.post('/', libraryValidation, libraryController.createLibrary);

// Update a library by ID
router.put('/:id', validateObjectId, libraryValidation, libraryController.updateLibrary);

// Delete a library by ID
router.delete('/:id', validateObjectId, libraryController.deleteLibrary);

// Define the upload route
// 'image' is the field name expected in the form-data upload
router.post('/portrait', upload.single('image'), libraryController.uploadImage);

module.exports = router;