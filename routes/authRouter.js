const express = require('express');
const router = express.Router();
const { registerUser,loginUser } = require('../controller/authController');

// POST /api/register
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
