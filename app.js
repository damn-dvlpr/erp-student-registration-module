const express=require('express');
var mongoose=require("mongoose");
var bodyParser=require('body-parser');
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';
const app=express();
mongoose.connect("mongodb://localhost:27017/students");
app.use(bodyParser.urlencoded({extended:true}));
var studentSchema=new mongoose.Schema({                                      
    name: String,
    date_of_birth:Date,
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    blood_group:{
        type:String,
        enum:["a+","b+","ab+","o+"]
    },    
    pwd_status:{
        type:String,
        enum:["yes","no"]
    },
    social_category:{
        type:String,
        enum:["general","obc-ncl","sc/st"]
    },
    marital_status:{
        type:String,
        enum:["married","unmarried"]
    },
    religion:{
        type:String,
    },
    nationality:{
        type:String,
    },
    aadhar:{
        type:Number,
        maxlength:16,
        minlength:16
    },
    phone:{
        type:Number,
        maxlength:10,
        minlength:10
    },
    email:{
        type:mongoose.SchemaTypes.Email,
    },
    address:{
        type:String,
    },
});
var Student=mongoose.model("Student",studentSchema);
app.get("/register",function(req,res){
    res.render("register.ejs");
});
app.post("/register",function(req,res){
    var student_info=req.body;
    Student.create(student_info,function(err,returnedData){
        if(err){
            console.log(err);
        }else{
            console.log(returnedData);
            res.redirect("/register");
        }
    })
});
app.listen(8080,function(){
    console.log("server running at 8080")
})