
const category=require('../model/categoryModel')
const blogData=require('../model/BlogModel')
const commentModel=require('../model/commentModel');
const User = require('../model/userModel');
const { response } = require('express');
module.exports.home=async(req,res)=>{
    try{
        
    let search='';
        if(req.query.homeSearch){
            search=req.query.homeSearch
        }
           let perpage=3;
        let page=0;
        
        if(req.query.page){
            page=req.query.page
        }
        let allCategorys=await category.find({status:true});
        let allBlog;

        let allBlogCount = await blogData.find({status:true}).countDocuments();
        let sortData = '';
        if(req.query.sorting){
            sortData = req.query.sorting;
        }

        let cateId ='';
        if(req.query.catid){
            cateId = req.query.catid;
        }
        if(req.query.catid){
            if(req.query.sorting=='asc'){
                allBlog=await blogData.find({status:true,categoryId:req.query.catid,
                    $or:[
                            {title:{$regex:search}}
                    ]}).skip(page*perpage).limit(perpage).sort({_id:1})
            }
            else{
                allBlog=await blogData.find({status:true,categoryId:req.query.catid,
                    $or:[
                            {title:{$regex:search}}
                    ]}).skip(page*perpage).limit(perpage).sort({_id:-1})
            }
               
        }else{
             if(req.query.sorting=='asc'){
                allBlog=await blogData.find({status:true,
                    $or:[
                            {title:{$regex:search}}
                    ]}).skip(page*perpage).limit(perpage).sort({_id:1})
            }
            else{
                allBlog=await blogData.find({status:true,
                    $or:[
                            {title:{$regex:search}}
                    ]}).skip(page*perpage).limit(perpage).sort({_id:-1})
            }
          
        }
      

 const totalRecord = await blogData.find({  $or:[
                {title:{$regex:search}}
            ]}).countDocuments()
    let totalData =Math.ceil(totalRecord/perpage)

        return res.render('userPanel/home',{allCategorys,allBlog,search,totalData,page,allBlogCount,sortData,cateId})
        
     
    }catch(err){
        req.flash('error','something went wrong')
        return res.redirect('back')
    }
}

module.exports.readMore=async(req,res)=>{
    try{
        let postId=req.params.id;
         let search='';
        if(req.query.homeSearch){
            search=req.query.homeSearch
        }
       
let id=req.params.id
    let viewcomments=await commentModel.find({status:true,postId:req.params.id})
       let singleObj=await blogData.findById(id)
 let allBlog=await blogData.find({status:true,
         $or:[
                {title:{$regex:search}}
            ]}).sort({_id:-1}).limit(5)

         
        return res.render('userPanel/readMore',{singleObj,postId,allBlog,search,viewcomments})
    }catch(err){
        req.flash('error','something went wrong')
        return res.redirect('back')
    }
}

module.exports.addComment=async(req,res)=>{
    // console.log(req.body)
    // console.log(req.file)

    let newImg='';
    if(req.file){
        newImg=await commentModel.imgpath+'/'+req.file.filename
    }
    req.body.Image=newImg;
    let addComment=await commentModel.create(req.body)
    if(addComment){
        let findComment=await blogData.findById(req.body.postId)
       
         findComment.commentIds.push(addComment._id);
        await blogData.findByIdAndUpdate(req.body.postId,findComment)
    }
    return res.redirect('back')
}


module.exports.commentsview=async(req,res)=>{

    let viewcomments=await commentModel.find({postId:req.params.id,status:true})
    return res.render('commentsview',{
        viewcomments
    })
}

module.exports.viewCom=async(req,res)=>{

    let viewcomments=await commentModel.find({status:true})
    return res.render('viewCom',{
        viewcomments
    })
}


module.exports.ActiveStatus=async(req,res)=>{
    try{
        await commentModel.findByIdAndUpdate(req.query.comId,{"status":false})
        req.flash('success','data update sucefully')
        return res.redirect('back')

    }catch(err){
        // console.log("not working active")
        req.flash('error','not working active')
        return res.redirect('back')
    }
}

module.exports.DeActiveStatus=async(req,res)=>{
    try{
        await commentModel.findByIdAndUpdate(req.query.comId,{"status":true})
        req.flash('success','data update sucefully')
        return res.redirect('back')

    }catch(err){
        // console.log("not working active")
        req.flash('error','not working active')
        return res.redirect('back')
    }
}


module.exports.userRegister=async(req,res)=>{
    return res.render('userPanel/userRegister')
}

module.exports.adduser=async(req,res)=>{
    if(req.body.password==req.body.confirmPassword){

        let userAdd=await User.create(req.body)
        if(userAdd){
            console.log('register succesfully')
            return res.redirect('/userLogin')
           }
           else{
            return res.redirect('back')
           }
    }else{
        console.log("password is not match")
    }

   
    // return res.redirect('back')
}

module.exports.userLogin=async(req,res)=>{
    return res.render('userPanel/userLogin')
}

module.exports.checkuser=async(req,res)=>{
    
    return res.redirect('/')
}

module.exports.logout=async(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            return false
        }
        else{

         
    return res.redirect("/");
        }
    })
}


module.exports.LikeUser=async(req,res)=>{
    
try{
// console.log(req.params.commentIds)

let singleData=await commentModel.findById(req.params.commentIds)

console.log(singleData)
if(singleData){
    let likeIsAllRealdyExist=singleData.likes.includes(req.user._id)
    if(likeIsAllRealdyExist){
        let newdata=singleData.likes.filter((v,i)=>{
            if(!v.equals(req.user._id)){
                return v;
            }
        })
        singleData.likes=newdata;

    }else{
         singleData.likes.push(req.user._id)
    }
     await commentModel.findByIdAndUpdate(req.params.commentIds,singleData)

  let deslikeCheck=singleData.dislikes.includes(req.user._id)
    if(deslikeCheck){
        let newdata=singleData.dislikes.filter((v,i)=>{
            if(!v.equals(req.user._id)){
                return v;
            }
        })
        singleData.dislikes=newdata;
     await commentModel.findByIdAndUpdate(req.params.commentIds,singleData)

    }

         return res.redirect('back')

}else{
    console.log("comment is not found")
    return res.redirect('back')
}


}catch(err){
    console.log(err)
    return res.redirect('back')
}


    
}




module.exports.DisLikeUser=async(req,res)=>{
    
      
try{
// console.log(req.params.commentIds)

let singleData=await commentModel.findById(req.params.commentIds)

console.log(singleData)
if(singleData){
    let likeIsAllRealdyExist=singleData.dislikes.includes(req.user._id)
    if(likeIsAllRealdyExist){
        let newdata=singleData.dislikes.filter((v,i)=>{
            if(!v.equals(req.user._id)){
                return v;
            }
        })
        singleData.dislikes=newdata;

    }else{
         singleData.dislikes.push(req.user._id)
    }
     await commentModel.findByIdAndUpdate(req.params.commentIds,singleData)


    let likeCheck=singleData.likes.includes(req.user._id)
    if(likeCheck){
        let newdata=singleData.likes.filter((v,i)=>{
            if(!v.equals(req.user._id)){
                return v;
            }
        })
        singleData.likes=newdata;
     await commentModel.findByIdAndUpdate(req.params.commentIds,singleData)

    }

         return res.redirect('back')

}else{
    console.log("comment is not found")
    return res.redirect('back')
}


}catch(err){
    console.log(err)
    return res.redirect('back')
}
}
