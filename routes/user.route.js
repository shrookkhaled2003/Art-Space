const express = require('express');
const validateRequest = require('../middleware/user.validator.js');
const verfiyToken = require('../middleware/verifyToken.js');

const router = express.Router();

const userController = require('../controllers/user.controller')

router.get('/',verfiyToken,userController.getAllUsers)

  router.post('/register', validateRequest(["name", "email", "password"]), userController.register);

  router.post('/login', validateRequest(["email", "password"]), userController.login);

module.exports = router;