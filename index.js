const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRouter');
const serviceRoutes = require('./routes/serviceRouter');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded form data

// Routes
app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);

// Health check route (optional)
app.get('/', (req, res) => res.send('API is running...'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
