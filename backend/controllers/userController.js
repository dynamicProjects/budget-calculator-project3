const User = require('../models/User');
const passport = require('passport');

// Register User
exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  User.register(new User({ username, email }), password, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login User
exports.loginUser = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: 'User logged in successfully' });
    });
  })(req, res);
};

// Logout User
exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: 'User logged out successfully' });
  });
};