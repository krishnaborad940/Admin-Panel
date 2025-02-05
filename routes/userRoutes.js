const express = require('express')

const userRoutes=express.Router()

const userCtl=require('../controller/userControllers')
const commentModel=require('../model/commentModel')
const passport = require('passport')

userRoutes.get("/",userCtl.home)
userRoutes.get("/readMorE/:id",userCtl.readMore)

userRoutes.post('/addComment',commentModel.Uploadimage,userCtl.addComment)

// userRoutes.get('/commentsview/:id',userCtl.commentsview)

userRoutes.get('/viewCom',userCtl.viewCom) 
userRoutes.get('/ActiveStatus',userCtl.ActiveStatus)

userRoutes.get('/DeActiveStatus',userCtl.DeActiveStatus)

userRoutes.get('/userRegister',userCtl.userRegister)

userRoutes.post('/adduser',userCtl.adduser)
userRoutes.get('/userLogin',userCtl.userLogin)

userRoutes.get('/logout',userCtl.logout)

userRoutes.get('/LikeUser/:commentIds',userCtl.LikeUser)

userRoutes.get('/DisLikeUser/:commentIds',userCtl.DisLikeUser)



userRoutes.post('/checkuser',passport.authenticate("userAuth",{failureRedirect:'/'}),userCtl.checkuser)





module.exports=userRoutes