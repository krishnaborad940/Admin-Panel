
const express=require("express");

const port=8002;

const app=express();

const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const cookieparser=require("cookie-parser");
app.use(cookieparser());
const flash=require('connect-flash')
const  flashMessages=require('./config/FlashMessages')

const session=require('express-session')
const passport=require('passport')
const LocalStrategy=require('./config/passport-local-strategy')

app.use(express.urlencoded());

// const db=require("./config/db");
const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://boradkrishna940:ZYQJTHTvp81MCI9X@first.7vdki.mongodb.net/admindata',{

}).then((res)=>console.log("db is connectd"))
.catch((err)=>{console.log(err)
})

app.use(express.static(path.join(__dirname,"assets")));

app.use("/Uploads",express.static(path.join(__dirname,"Uploads")))
app.use("/Uploads/blogImage",express.static(path.join(__dirname,"Uploads/blogImage")))
app.use("/Uploads/userImage",express.static(path.join(__dirname,"Uploads/userImage")))
app.use(session({
    name:'RNW',
    secret:'rnw-Test',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(flashMessages.setFlash)

app.use(passport.setAuthUser)

app.use("/",require("./routes/adminroutes"));
// app.use("/category",require("./routes/categoryRoutes"));
app.use('/category',require('./routes/categoryRoutes'))


app.listen(port,(err)=>{
    if(err){
        console.log("error");
        return false;
    }
    console.log("server is run:",port);
})