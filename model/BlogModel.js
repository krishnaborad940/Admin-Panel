const mongoose=require('mongoose')
const ImagePath="/Uploads/blogImage";

const multer=require("multer");

const path=require("path");
const blogSchema=mongoose.Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'category',
         required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    
    status:{
        type:Boolean,
        required:true,default:true
    },
    image:{
        type: String,
        required:false
    },
    commentIds:[
        {
              type: mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
 
},{
    timestamps:true
})

const storageimage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",ImagePath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
    
})

blogSchema.statics.Uploadimage=multer({storage:storageimage}).single("image");
blogSchema.statics.imgpath=ImagePath;

const blogData=mongoose.model("blogData",blogSchema)

module.exports=blogData