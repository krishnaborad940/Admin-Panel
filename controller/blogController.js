const blogData = require("../model/BlogModel")
const category=require('../model/categoryModel');
const fs=require('fs')
const { search } = require("../routes/BlogRoutes");

const {validationResult}=require('express-validator')
module.exports.AddBlog = async (req, res) => {
    try {
        const categorydata = await category.find();
        return res.render('blogs/AddBlog', { categorydata,old:[],errorsData:[] });
    } catch (err) {
        console.log('Something went wrong:', err);
        req.flash('error','Something went wrong')
        return res.redirect('back');
    }
};
module.exports.ViewBlog = async (req, res) => {

    try {
        let search='';
        if(req.query.blogSearch){
            search=req.query.blogSearch
        }
        let perpage=3;
        let page=0;
        
        if(req.query.page){
            page=req.query.page
        }
        

        const viewBlogData = await blogData.find({  $or:[
            {title:{$regex:search}},
           
              {description:{$regex:search}}
        ]}).skip(page*perpage).limit(perpage).populate('categoryId').exec();

        const totalRecord = await blogData.find({  $or:[
            {title:{$regex:search}},
             {author:{$regex:search}},
              {description:{$regex:search}}
        ]}).countDocuments()
let totalData=(Math.ceil(totalRecord/perpage))

        return res.render('blogs/ViewBlog', { viewBlogData,search,totalData,page });



    } catch (err) {
        console.log('Something went wrong:', err);
        req.flash('error','Something went wrong')
        return res.redirect('back');
    }
};


module.exports.insertBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        console.log(errors);

        const categorydata = await category.find(); 
        if (!errors.isEmpty()) {
            return res.render("blogs/AddBlog", {
                errorsData: errors.mapped(),  
                old: req.body,  
                categorydata
            });
        } else {
            let imagespath = '';
            if (req.file) {
                imagespath = await blogData.imgpath + "/" + req.file.filename;
            }
            req.body.image = imagespath; 
            let blogdetails = await blogData.create(req.body);
            if (blogdetails) {
                let findCategory = await category.findById(req.body.categoryId);
                findCategory.blogId.push(blogdetails._id); 
                await category.findByIdAndUpdate(req.body.categoryId, findCategory); 

                req.flash('success', 'Blog Added Successfully');
                return res.redirect('/blogs');
            } else {
                req.flash('error', 'Blog data is not added');
                return res.redirect('back');
            }
        }
    } catch (err) {
        
        req.flash('error', 'Blog data is not added due to an error');
        return res.redirect('back');
    }
};


module.exports.deleteBlog=async(req,res)=>{
    try{
       let deletBlog=await blogData.findById(req.query.id)
       if(deletBlog){
          try{
                  let deleteimg=path.join(__dirname,"..",deletBlog.image);
                    fs.unlinkSync(deleteimg);
                }
                catch{
                    // console.log("image not found")
            req.flash('error','image not found')
                    return res.redirect("back");
                }
                  let deletepath=await blogData.findByIdAndDelete(id);
        if(deletepath){  
            // console.log("data delete")
            req.flash('error','data delete')
            return res.redirect("back")
        }
        else{
        //  console.log("data not delete")
            req.flash('error','data not delete')
         return res.redirect("back")
        }
       }else{
        // console.log("blog data is not deleted")
            req.flash('error','blog data is not deleted')

        return res.redirect('back')
       }
    }catch(err){
        // console.log("somthing went wrong")
            req.flash('error','somthing went wrong')
        return res.redirect('back')
    }
}

module.exports.updateBlog=async(req,res)=>{
    try{
       let updateblog=await blogData.findById(req.query.id)
         const categorydata = await category.find();
       return res.render('blogs/updateBlog',{updateblog,categorydata})
     
    }catch(err){
        // console.log("somthing went wrong")
           req.flash('error','somthing went wrong')
        return res.redirect('back')
    }
}
module.exports.EditBlog = async (req, res) => {
    try {
          if(req.file){
            let singledata=await blogData.findById(req.body.id);
            try{
                let oldimage=path.join(__dirname,"..",singledata.image);
                fs.unlinkSync(oldimage);
            }
            catch{
                console.log("image not found");
            }
            let newimg=await blogData.imgpath+"/"+req.file.filename;
            req.body.image=newimg
            let updatedata=await blogData.findByIdAndUpdate(req.body.id,req.body);
            if(updatedata){
                // console.log("data update sucefully");
                   req.flash('success','data update sucefully')
                return res.redirect("/blogs/ViewBlog")
             }
             else{
                // console.log("data not update");
                  req.flash('error','data not updated')
                return res.redirect("back");
             }

          }
    else{
            let singledata=await blogData.findById(req.body.id);
            req.body.image=singledata.image;
            let updatedata=await blogData.findByIdAndUpdate(req.body.id,req.body);
            if(updatedata){
                // console.log("data update sucefully");
                  req.flash('success','data update sucefully')
                return res.redirect("/blogs/ViewBlog")
             }
             else{
                // console.log("data not update");
                  req.flash('error','data not update')
                return res.redirect("back");
             }
        }



    } catch (err) {
        console.error('Something went wrong:', err);
          req.flash('error','Something went wrong')
        return res.redirect('back');
    }
};

module.exports.MultipleDelete=async(req,res)=>{
    try{
// console.log(req.body.checkInput)
await blogData.deleteMany({_id:{$in:req.body.checkInput}})
req.flash('success','data delete sucefully')
return res.redirect('back')
    }catch(err){
        // console.log("multiple delete is not working")
        req.flash('error','multiple delete is not working')
        return res.redirect('back')
    }
}

module.exports.ActiveStatus=async(req,res)=>{
    try{
        await blogData.findByIdAndUpdate(req.query.blogId,{"status":false})
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
        await blogData.findByIdAndUpdate(req.query.blogId,{"status":true})
        req.flash('success','data update sucefully')
        return res.redirect('back')

    }catch(err){
        // console.log("not working active")
        req.flash('error','not working active')
        return res.redirect('back')
    }
}

module.exports.asendingData=async(req,res)=>{

    try {
        let search='';
        if(req.query.blogSearch){
            search=req.query.blogSearch
        }
        let perpage=3;
        let page=0;
        
        if(req.query.page){
            page=req.query.page
        }
        

        const viewBlogData = await blogData.find({  $or:[
            {title:{$regex:search}},
           
              {description:{$regex:search}}
        ]}).skip(page*perpage).limit(perpage).sort({title:1}).populate('categoryId').exec();

        const totalRecord = await blogData.find({  $or:[
            {title:{$regex:search}},
             {author:{$regex:search}},
              {description:{$regex:search}}
        ]}).countDocuments()
let totalData=(Math.ceil(totalRecord/perpage))

        return res.render('blogs/ViewBlog', { viewBlogData,search,totalData,page });



    } catch (err) {
        console.log('Something went wrong:', err);
        req.flash('error', 'Something went wrong')
        return res.redirect('back');
    }

}

 module.exports.desendingData=async(req,res)=>{
 

    try {
        let search='';
        if(req.query.blogSearch){
            search=req.query.blogSearch
        }
        let perpage=3;
        let page=0;
        
        if(req.query.page){
            page=req.query.page
        }
        

        const viewBlogData = await blogData.find({  $or:[
            {title:{$regex:search}},
           
              {description:{$regex:search}}
        ]}).skip(page*perpage).limit(perpage).sort({title:-1}).populate('categoryId').exec();

        const totalRecord = await blogData.find({  $or:[
            {title:{$regex:search}},
             {author:{$regex:search}},
              {description:{$regex:search}}
        ]}).countDocuments()
let totalData=(Math.ceil(totalRecord/perpage))

        return res.render('blogs/ViewBlog', { viewBlogData,search,totalData,page });



    } catch (err) {
        console.log('Something went wrong:', err);
        req.flash('error', 'Something went wrong')
        return res.redirect('back');
    }
};

