
const { validationResult } = require('express-validator')
const category=require('../model/categoryModel')

module.exports.AddCategory=async(req,res)=>{
    try{
        return res.render('category/AddCategory',{
            old:[],
            errorsData:[]
        })
    }catch(err){
        // console.log("somthing went wrong")
        req.flash('error','somthing went wrong')
        return res.redirect('back')
    }
}
module.exports.ViewCategory=async(req,res)=>{
    try{
   let search='';
        if(req.query.blogSearch){
            search=req.query.blogSearch
        }


  let perpage=3;
        let page=0;
        
        if(req.query.page){
            page=req.query.page
        }

        let order=req.query.order==="asc"?1:-1;
        const sortOrder=req.query.order||"asc"
// console.log(req.query.page)
        let viewcategoryItem=await category.find({  $or:[
            {categoryName:{$regex:search}}
        ]}).skip(page*perpage).limit(perpage).sort({categoryName:order})

  const totalRecord = await category.find({  $or:[
            {categoryName:{$regex:search}},

        ]}).countDocuments()
let totalData=Math.ceil(totalRecord/perpage)
console.log(totalData)
        if(viewcategoryItem){
            console.log("added succesfully")
        return res.render('category/ViewCategory',{viewcategoryItem,search,totalData,page,order:sortOrder})



    }else{
        // console.log("categoryData is not added")
        req.flash('error','categoryData is not added')
        return res.redirect('back')
    }
    
    }catch(err){
        // console.log("somthing went wrong");
        req.flash('error','somthing went wrong')
        return res.redirect('back')
    }
}

module.exports.insertCategory=async(req,res)=>{
    try{

        const errors = validationResult(req);
        // console.log(errors);

        
        if (!errors.isEmpty()) {
        
            return res.render("category/AddCategory", {
                errorsData: errors.mapped(),  
                old: req.body,  
              
            });
}else {
    await category.create(req.body)
        
            // console.log("added succesfully")
            req.flash('success',"added succesfully")
            return res.redirect('/category')
    }
    
    
    }catch(err){
        // console.log("data is not added")
        req.flash('error','data is not added')
        return res.redirect('back')
    }
}

module.exports.deleteCategory=async(req,res)=>{
try{
    let id=req.query.id

    let delcat=await category.findByIdAndDelete(id)
    if(delcat){
        // console.log("data was deleted")
        req.flash('success',"data was deleted")
        return res.redirect('back')
    }
}catch(err){
    // console.log("data was not deleted")
    req.flash('error','data was not deleted')
    return res.redirect('back')
}
   
}

module.exports.updateCategory=async(req,res)=>{
try{
    let id=req.query.id
    let findid=await category.findById(id)


return res.render('category/UpdateCategory',{
    findid
})
}catch(err){
    // console.log("data was not transfer for update page")
    req.flash('error','data was not transfer for update page')
    return res.redirect('back')
}
   
}


module.exports.editCategory=async(req,res)=>{
    
    
   await category.findById(req.body.id)
    await category.findByIdAndUpdate(req.body.id,req.body)


return res.redirect('/categoryPages/ViewCategory')
}

module.exports.MultipleDel=async(req,res)=>{
    try{
        console.log(req.body.Ids)
        let delcheck =await category.deleteMany({_id:{$in:req.body.Ids}})
        if(delcheck){
            // console.log("data was deleted")
            req.flash('success',"data was deleted")
            return res.redirect('back')
        }else{
            // console.log("data was not deleted")
            req.flash('error',"data was not deleted")
            return res.redirect('back')
        }
    }catch(err){
        // console.log("data was not deleted")
        req.flash('error',"data was not deleted")
        return res.redirect('back')
    }
}


module.exports.ActiveTrue=async(req,res)=>{
try{
    let catUpdate=await category.findByIdAndUpdate(req.query.CateId,{"status":false})
    return res.redirect('back')

}
catch(err){
    // console.log("something went wrong")
    req.flash('error',"something went wrong")
    return res.redirect('back')
}
}



module.exports.ActiveFalse=async(req,res)=>{
try{
    let catUpdate=await category.findByIdAndUpdate(req.query.CateId,{"status":true})
    return res.redirect('back')

}
catch(err){
    // console.log("something went wrong")
    req.flash('error',"something went wrong")
    return res.redirect('back')
}
}



