const express = require('express');
const validateRequest = require('../middleware/user.validator.js');
const verifyToken = require('../middleware/verifyToken.js');

const router = express.Router();
const userController = require('../controllers/user.controller');

// Fetch all users (Admin only)
router.get('/', verifyToken, userController.getAllUsers);

// Register a new user
router.post('/register', validateRequest(["name", "email", "password", "role"]), userController.register);

// User login
router.post('/login', validateRequest(["email", "password"]), userController.login);

// Complete artist profile
router.post('/complete-profile', verifyToken, userController.completeArtistProfile);

module.exports = router;
