const express = require('express');
const profileRouter = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getMyProfile, updateMyProfile, deleteMyAccount } = require('../controllers/profileController');

// GET own profile
profileRouter.get('/me', authMiddleware, getMyProfile);

// UPDATE own profile
profileRouter.put('/me', authMiddleware, updateMyProfile);

// DELETE own account
profileRouter.delete('/me', authMiddleware, deleteMyAccount);

module.exports = profileRouter;
