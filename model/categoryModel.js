const mongoose=require('mongoose')

const categorySchema=mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    blogId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogData"
    }]
},{
    timestamps:true
})

const category=mongoose.model("category",categorySchema)

module.exports=category