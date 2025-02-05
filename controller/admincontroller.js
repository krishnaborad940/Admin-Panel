const Admin=require("../model/adminmodel");
const category=require('../model/categoryModel')
const fs=require("fs");
const path=require("path");
const nodemailer = require("nodemailer");
const { clearCache } = require("ejs");
const blogData = require("../model/BlogModel");
const comments=require('../model/commentModel');
const { error } = require("console");
const {validationResult}=require('express-validator')

module.exports.Dashboard=async(req,res)=>{

    let categoryTotal = await category.find();
     let blogTotal = await blogData.find().populate('categoryId').exec();
 let commentsTotal=await comments.find().populate('postId').exec();

 let comTotal=commentsTotal.length;

     let catTotal=categoryTotal.length;
     let total = blogTotal.length;  
     let lableN=[];
     let blog=[];
 
     categoryTotal.map((v,i )=>{ 
        lableN.push(v.categoryName)
    });
  let lableB = categoryTotal.map((v) => {
  return blogTotal.filter((blog) => blog.categoryId && blog.categoryId.equals(v._id)).length;
});

let lableb3 = categoryTotal.map((v) => {
    return commentsTotal.filter(b => b.postId && b.postId.categoryId.equals(v._id)).length;
});



blogTotal.map((v,i)=>{
blog.push(v.blogData)
})
     console.log(lableb3)
 
    //  console.log(req.isAuthenticated());
     return res.render("Dashboard", {comTotal, lableb3,total,lableB,blog, blogTotal,lableN ,catTotal});
    
 } 

 module.exports.dashbordsecound=async(req,res)=>{
    return res.render('dashbordsecound')
 }

module.exports.addadmin=async(req,res)=>{
   
        return res.render("addadmin",{old:[],errorsData:[]});
 
    
}

module.exports.insertadmin=async(req,res)=>{
    try{
          const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            return res.render("addadmin", {
                errorsData: errors.mapped(),  
                old: req.body
            });
       }else{
         let imagespath='';
        if(req.file){
            imagespath=await Admin.imgpath+"/"+req.file.filename;
        }
        req.body.image=imagespath;
        req.body.name=req.body.fname+" "+req.body.lname;
        let admindata=await Admin.create(req.body);
        if(admindata){
            // console.log("data sucefully add");
            req.flash("success",'data sucefully add')
            return res.redirect("/addadmin");
        }
        else{
            // console.log("data not found");
            req.flash("error",'data not found')
            return res.redirect("back");
        }
    
       }
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back");
    }
}

module.exports.viewadmin=async(req,res)=>{
    try{
        let search='';
        if(req.query.adminSearch){
            search=req.query.adminSearch
        }
        let perpage=3;
        let page=0;
        
        if(req.query.page){
            page=req.query.page
        }
        
            let viewdata=await Admin.find({  $or:[
                {email:{$regex:search}},
                {name:{$regex:search}}
            ]}).skip(page*perpage).limit(perpage).populate().exec();

            const totalRecord = await Admin.find({  $or:[
                {email:{$regex:search}},
                {name:{$regex:search}}
            ]}).countDocuments()
    let totalData =Math.ceil(totalRecord/perpage)
              return res.render("viewadmin",{
               
            viewdata,search,totalData,page
        })
       
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back");
    }
}

module.exports.deleteadmin=async(req,res)=>{
    try{
       id=req.params.id;
       let getdata=await Admin.findById(id);
       if(getdata){
        try{
            deleteimg=path.join(__dirname,"..",getdata.image);
            fs.unlinkSync(deleteimg);
        }
        catch{
            // console.log("image not found");
            req.flash("error",'image not found')
            return res.redirect("back");
        }
        let deletepath=await Admin.findByIdAndDelete(id);
        if(deletepath){  
            // console.log("data delete")
            req.flash("success",'data delete')
            return res.redirect("back")
        }
        else{
        //  console.log("data not delete")
            req.flash("error",'data not delete')
         return res.redirect("back")
        }
       }
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back");
    }
}

module.exports.updateadmin=async(req,res)=>{
    try{
        id=req.query.adminid;
        let singleadmin=await Admin.findById(id);
        if(singleadmin){
            return res.render("updateadmin",{
                singleadmin
            })
        }
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back");
    }
}

module.exports.editadmin=async(req,res)=>{
    try{
        if(req.file){
            let singledata=await Admin.findById(req.body.aid);
            try{
                let oldimage=path.join(__dirname,"..",singledata.image);
                fs.unlinkSync(oldimage);
            }
            catch{
                console.log("image not found");
            }
            let newimg=await Admin.imgpath+"/"+req.file.filename;
            req.body.image=newimg
            req.body.name=req.body.fname+""+req.body.lname;
            let updatedata=await Admin.findByIdAndUpdate(req.body.aid,req.body);
            if(updatedata){
                // console.log("data update sucefully");
                req.flash("success",'data update sucefully')
                return res.redirect("viewadmin")
             }
             else{
                // console.log("data not update");
                req.flash("error",'data not update')
                return res.redirect("back");
             }

        }
        else{
            let singledata=await Admin.findById(req.body.aid);
            req.body.image=singledata.image;
            let updatedata=await Admin.findByIdAndUpdate(req.body.aid,req.body);
            if(updatedata){
                // console.log("data update sucefully");
                req.flash("success",'data update sucefully')
                return res.redirect("viewadmin")
             }
             else{
                // console.log("data not update");
                req.flash("error",'data not update')
                return res.redirect("back");
             }
        }

    }
   catch{
    // console.log("somthing is wrong");
    req.flash("error",'somthing is wrong')
    return res.redirect("back");
    }
}

module.exports.signin=async(req,res)=>{
    try{
        return res.render("signin");
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
    return res.redirect("back");
    }
}

module.exports.checksignin=async(req,res)=>{
    try{
        req.flash("success",'Login successfully')
        return res.redirect("/Dashboard");
    }  
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back");
    }
}

module.exports.signout=async(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            return false
        }
        else{

            req.flash("success",'Logout successfully')
    return res.redirect("/");
        }
    })
}

module.exports.myprofile=async(req,res)=>{
    try{
         let viewdata=await Admin.find();
        return res.render("myprofile",{viewdata})
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back");
    }
}

module.exports.changepassword=async(req,res)=>{
    try{
        return res.render("changepassword");
    }
    catch{
        // console.log("somthing is wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back")
    }
}

module.exports.changenewpassword=async(req,res)=>{
    try{
         let olddata=req.user
         if(olddata.password==req.body.currentpassword){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    let editpassword=await Admin.findByIdAndUpdate(olddata._id,{password:req.body.newpassword});
                        return res.redirect("/signout");
                }
                else{
                    console.log("new and confirm password are not match")
                }

            }
            else{
                console.log("current and new password are match!try again")
            }

         }
         else{
            console.log("current password not match");

         }
    }
    catch{
        // console.log("somthing wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back")
    }
}

module.exports.checkemail=async(req,res)=>{
    try{
        return res.render("checkemail");
    }
    catch{
        // console.log("somthing wrong");
        req.flash("error",'somthing is wrong')
        return res.redirect("back")
    }
}

module.exports.verifyemail=async(req,res)=>{
    try{
        console.log(req.body);
         
         let singleobj=await Admin.find({email:req.body.email}).countDocuments();
         if(singleobj==1){
         let singleadmindata=await Admin.findOne({email:req.body.email})
         
         let OTP=Math.floor(Math.random()*100000)
         console.log(OTP)
         res.cookie('otp',OTP);
         res.cookie('email',singleadmindata.email);

         const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "bhargavitrapasiya12@gmail.com",
              pass: "lybrupwzswegwzjy",
            },
            tls:{
                 rejectUnauthorized:false
            }
          });

          const info = await transporter.sendMail({
            from: "bhargavitrapasiya12@gmail.com", // sender address
            to:"bhargavitrapasiya12@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>your OTP: ${OTP}</b>`, // html body
          });
          console.log("Message sent: ")

         }
         else{
            // console.log("invalid email");
            req.flash("error",'invalid email')
            return res.redirect("back")
         }

         return res.redirect("/checkotp");
        
       
    }
    catch{
        // console.log("somthing wronggg");
        req.flash("error",'somthing wrong')
        return res.redirect("back")
    }
}

module.exports.checkotp=async(req,res)=>{
    try{
        return res.render("checkotp");
    }
    catch{
        // console.log("somthing wrong");
        req.flash("error",'somthing wrong')
        return res.redirect("back")
    }
}

module.exports.verifyotp=async(req,res)=>{
    try{
        if(req.body.otp==req.cookies.otp){
            res.clearCookie("otp");

            return res.redirect("/forgetpass");
        }
        else{
            // console.log("Invalid otp");
            req.flash("error",'Invalid otp')
            return res.redirect("back")
        }
    }
    catch{
        // console.log("somthing wrong");
        req.flash("error",'somthing wrong')
        return res.redirect("back")
    }
}

module.exports.forgetpass=async(req,res)=>{
    try{
        return res.render("forgetpass")

    }
    catch{
        // console.log("somthing wrong");
        req.flash("error",'somthing wrong')
        return res.redirect("back")
    }
}

module.exports.verifypass=async(req,res)=>{
    try{
        if(req.body.newpassword==req.body.confirmpassword){
            let checklastime=await Admin.find({email:req.cookies.email}).countDocuments();
            if(checklastime==1){
                let admindatanew=await Admin.findOne({email:req.cookies.email});
                let updatepass=await Admin.findByIdAndUpdate(admindatanew.id,{password:req.body.newpassword});
                if(updatepass){
                    res.clearCookie("email");
                    return res.redirect("/");
                }
                else{
                    // console.log("somthing is wrong");
                    req.flash("error",'somthing is wrong')
                    return res.redirect("back")
                }
            }
            else{
                // console.log("invalid email");
                req.flash("error",'invalid email')
                return res.redirect("back")
            }

        }
        else{
            // console.log("new and confirm are not match!try again");
            req.flash("error",'new and confirm are not match!try again')
            return res.redirect("back")
        }
    }
    catch{
        // console.log("somthing wrong");
        req.flash("error",'somthing wrong')
        return res.redirect("back")
    }
}

module.exports.MultipleDeleteAdmin=async(req,res)=>{
    try{
        await Admin.deleteMany({_id:{$in:req.body.checkadmin}})
        return res.redirect('back')
    }catch(err){
        console.log("somthing wrong");
        req.flash("error",'somthing wrong')
        return res.redirect("back")
    }
}