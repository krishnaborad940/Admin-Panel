const express=require('express')

const blogRoutes=express.Router()
const passport=require('../config/passport-local-strategy')
const blogCtl=require('../controller/blogController')
const blogData=require("../model/BlogModel")
const {check,validationResult}=require('express-validator')

blogRoutes.get('/',passport.checkAuth,blogCtl.AddBlog)
blogRoutes.post('/insertBlog',blogData.Uploadimage,[
    check('categoryId').notEmpty().withMessage('category is required'),
      check('title').notEmpty().withMessage('title is required'),
      check('description').notEmpty().withMessage('description is required')
      
],blogCtl.insertBlog)

blogRoutes.get('/ViewBlog',passport.checkAuth,blogCtl.ViewBlog)

blogRoutes.get('/deleteBlog',passport.checkAuth,blogCtl.deleteBlog)

blogRoutes.get('/updateBlog',passport.checkAuth,blogCtl.updateBlog)

blogRoutes.post('/EditBlog',blogCtl.EditBlog)

blogRoutes.post('/MultipleDelete',blogCtl.MultipleDelete)

blogRoutes.get('/ActiveStatus',blogCtl.ActiveStatus)

blogRoutes.get('/DeActiveStatus',blogCtl.DeActiveStatus)

blogRoutes.get('/asendingData',blogCtl.asendingData)

blogRoutes.get('/desendingData',blogCtl.desendingData)



module.exports=blogRoutes