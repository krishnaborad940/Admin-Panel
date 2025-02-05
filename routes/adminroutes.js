const express=require("express");

const routes=express.Router();

const Admin=require("../model/adminmodel");

const adminctl=require("../controller/admincontroller");
const passport = require("../config/passport-local-strategy");
const router = require("./categoryRoutes");

const {check,validationResult}=require('express-validator')
//login start

routes.get("/signin",adminctl.signin);

routes.post("/checksignin",passport.authenticate('local',{failureRedirect:'/signin'}),adminctl.checksignin);

routes.get("/signout",passport.checkAuth,adminctl.signout);

routes.get("/myprofile",passport.checkAuth,adminctl.myprofile);

routes.get("/changepassword",passport.checkAuth,adminctl.changepassword);

routes.post("/changenewpassword",adminctl.changenewpassword)

routes.get("/checkemail",adminctl.checkemail);

routes.post("/verifyemail",adminctl.verifyemail);

routes.get("/checkotp",adminctl.checkotp);

routes.post("/verifyotp",adminctl.verifyotp);

routes.get("/forgetpass",adminctl.forgetpass);

routes.post("/verifypass",adminctl.verifypass);

//login end

routes.get("/Dashboard",passport.checkAuth,adminctl.Dashboard);
routes.get('/dashbordsecound',passport.checkAuth,adminctl.dashbordsecound)

routes.get("/addadmin",passport.checkAuth,adminctl.addadmin);

// 
routes.post("/insertadmin",Admin.Uploadimage,[
    check('fname').notEmpty().withMessage('fname is required'),
    check('lname').notEmpty().withMessage('lname is required'),
    check('email').notEmpty().withMessage('email is required'),
    check('password').notEmpty().withMessage('fname is required').matches( /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).withMessage('8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
      check('city').notEmpty().withMessage('city is required'),
      check('gender').notEmpty().withMessage('gender is required'),
      check('hobby').notEmpty().withMessage('hobby is required')
      
],adminctl.insertadmin);

routes.get("/viewadmin",passport.checkAuth,adminctl.viewadmin);

routes.get("/deleteadmin/:id",adminctl.deleteadmin);

routes.get("/updateadmin",passport.checkAuth,adminctl.updateadmin);

routes.post("/editadmin",Admin.Uploadimage,adminctl.editadmin)

routes.post("/MultipleDeleteAdmin",adminctl.MultipleDeleteAdmin)

routes.use('/',require('./userRoutes'))

routes.use('/blogs',require('./BlogRoutes'))


module.exports=routes;