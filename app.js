const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Serve static HTML files from 'public' folder
app.use(express.static('public'));

// Body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/', authRoutes);

// Redirect root to register page
app.get('/', (req, res) => {
  res.redirect('/register.html');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
