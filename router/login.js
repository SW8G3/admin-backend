const express = require('express');
const router = express.Router();

const login = require('../controller/login');

// Route to handle user login
router.post('/login', login.login);

// Route to handle user registration
router.post('/register', login.createUser);

// Route to get user details by ID
router.get('/user/:id', login.getUser);

// Route to delete a user by ID
router.delete('/user/:id', login.deleteUser);

// Route to update user details by ID
router.put('/user/:id', login.updateUser);

module.exports = router;
