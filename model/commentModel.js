const mongoose=require('mongoose')
const ImagePath="/Uploads/userImage";

const multer=require("multer");

const path=require("path");
const CommentSchema=mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'blogData',
         required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    comments:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    Image:{
        type: String,
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
 
},{
    timestamps:true
})

const userSotrage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",ImagePath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
    
})

CommentSchema.statics.Uploadimage=multer({storage:userSotrage}).single("Image");
CommentSchema.statics.imgpath=ImagePath;

const Comment=mongoose.model("Comment",CommentSchema)

module.exports=Comment