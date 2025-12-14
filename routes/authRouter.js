const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
   updateUserProfile,
  
} = require('../controller/authController');

const verifyToken = require("../middleware/authMiddleware"); // ✅ Middleware import

// ✅ Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update',verifyToken, updateUserProfile);

// ✅ Protected route
router.get('/profile', verifyToken, getUserProfile); // User must be logged in

module.exports = router;
