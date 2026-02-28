const express = require('express');
const router = express.Router();
const { register, login, allUsers } = require('../controllers/authController');

router.post('/register', register);

router.post('/login', login);

router.get('/users/all', allUsers);

module.exports = router;
