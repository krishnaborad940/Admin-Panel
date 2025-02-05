const passport=require('passport')

const LocalStatertgy=require('passport-local').Strategy
const  adminmodel=require('../model/adminmodel')
const User = require('../model/userModel')


passport.use(new LocalStatertgy({
    usernameField: 'email'
},async function(email,password,done){
    console.log("midelware")
    console.log(email,password)
    let adminData=await adminmodel.findOne({email:email})
    if(adminData){
        if(adminData.password==password){
            return done(null,adminData)
        }else{
            return done(null,false)
        }
    }else{
        return done(null,false)
    }
}))

passport.use("userAuth",new LocalStatertgy({
    usernameField: 'email'
},async function(email,password,done){
    console.log("midelware")
    console.log(email,password)
    let adminData=await User.findOne({email:email})
    if(adminData){
        if(adminData.password==password){
            return done(null,adminData)
        }else{
            return done(null,false)
        }
    }else{
        return done(null,false)
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id)
})

passport.deserializeUser(async function(id,done){
    let adminRecord=await adminmodel.findById(id)
    if(adminRecord){
        return done(null,adminRecord)
    }
    else{
        let userRecord=await User.findById(id)
        if(userRecord){

            return done(null,userRecord)
        }else{
            return done(null,false)
        }
    }
})

passport.setAuthUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user
    }
    next()
}

passport.checkAuth=function(req,res,next){
    if(req.isAuthenticated()){
        next()
    }else{
        return res.redirect('/signin')
    }
}

module.exports=passport