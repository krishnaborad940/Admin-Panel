const express=require('express')

const router=express.Router()
const passport=require('../config/passport-local-strategy')

const categoryCtl=require('../controller/categoryController')

const {check,validationResult}=require('express-validator')

router.get('/',passport.checkAuth,categoryCtl.AddCategory)

router.get('/ViewCategory',passport.checkAuth,categoryCtl.ViewCategory)


router.post('/insertCategory',[
    check('categoryName').notEmpty().withMessage('category is required'),
],categoryCtl.insertCategory)

router.get('/deleteCategory',categoryCtl.deleteCategory)

router.get('/updateCategory',passport.checkAuth,categoryCtl.updateCategory)


router.post('/editCategory',categoryCtl.editCategory)

router.post('/MultipleDel',categoryCtl.MultipleDel)
router.get('/ActiveTrue',categoryCtl.ActiveTrue)

router.get('/ActiveFalse',categoryCtl.ActiveFalse)

// router.get('/asendingData',categoryCtl.asendingData)




module.exports=router;