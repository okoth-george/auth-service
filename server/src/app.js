const express = require('express');
const Endpoints = require('./routes/userRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');



const app = express();



const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
];
//origin: 'http
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware
app.use(morgan('combined')); // Log requests first
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 2 requests per windowMs
  message: "Too many login attempts, please try again in 15 minutes"
});
app.use('/api/users/login',limiter);

// Routes
app.use('/api/users', Endpoints);


// Root test route
app.get('/', (req, res) => {
  res.json({ message: "Auth API is running structure-style! 🚀" });
});

// This is a GET route, so your browser can see it!
app.get('/api/test', (req, res) => {
  res.send('<h1>The Auth API is alive and well! 🚀</h1>');
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

module.exports = app;