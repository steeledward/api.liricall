require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const packageRoutes = require('./routes/packageRoutes');
const saleRoutes = require('./routes/saleRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const creditRoutes = require('./routes/creditRoutes');
const refererRoutes = require('./routes/refererRoutes');

const app = express();
const port = process.env.PORT || 3003;

connectDB();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

app.use(express.json());
app.use('/api/packages', packageRoutes); // Add this line to use the package routes
app.use('/api/sales', saleRoutes);
app.use('/api/libraries', libraryRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/referers', refererRoutes);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
