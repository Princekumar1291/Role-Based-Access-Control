const express=require('express');
const authRouters=express.Router();
const authController=require("../controllers/authController")

authRouters.post('/signup',authController.signup);
authRouters.post('/login',authController.login);

module.exports=authRouters