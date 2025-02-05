const mongoose=require("mongoose");

const imagepath="/Uploads";

const multer=require("multer");

const path=require("path");

const AdminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    hobby:{
        type:Array,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }

})

const storageimage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imagepath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
    
})

AdminSchema.statics.Uploadimage=multer({storage:storageimage}).single("image");
AdminSchema.statics.imgpath=imagepath;


const Admin=mongoose.model("Admin",AdminSchema);
module.exports=Admin;