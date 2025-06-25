const express=require('express');
const authRouters=express.Router();
const authController=require("../controllers/authController")

authRouters.post('/signup',authController.signup);
authRouters.get('/verify-email', authController.verifyEmail);  // for clicking from email
authRouters.post('/login',authController.login);

module.exports=authRouters