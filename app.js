const express=require('express');
var mongoose=require("mongoose");
var bodyParser=require('body-parser');
require('mongoose-type-email');
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';
const app=express();
mongoose.connect("mongodb://localhost:27017/students");
app.use(bodyParser.urlencoded({extended:true}));
var GuardianSchema=new mongoose.Schema({
    father: String,
    mother:String,
    relative:String,
    address:{
        father:{type:String},
        relative:{type:String}
    },
    phone:{
        father:
            {
                type:Number,
                maxlength:10,
                minlength:10
            },
        mother:
            {
                type:Number,
                maxlength:10,
                minlength:10
            },
        relative:
            {
                type:Number,
                maxlength:10,
                minlength:10
            }
    },
    email:{
        father:{type: mongoose.SchemaTypes.Email},
        mother:{type: mongoose.SchemaTypes.Email},
        relative:{type: mongoose.SchemaTypes.Email}
    },
});
var PersonalSchema=new mongoose.Schema({                                      
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
var Personal=mongoose.model("PersonalSchema",PersonalSchema);
var Guardian=mongoose.model("GuardianSchema",GuardianSchema);
app.get("/register",function(req,res){
    res.render("register.ejs");
});
app.post("/register",function(req,res){
    var student_info=req.body;
    console.log(req.body);
    Personal.create(student_info,function(err,returnedData){
        if(err){
            console.log(err);
        }else{
            Guardian.create(student_info,function(err,returnedData){
                if(err){
                    console.log(err);
                }else{
                    console.log(returnedData);
                }    
            })
            console.log(returnedData);
            res.redirect("/register");
        }
    })
});
app.listen(8080,function(){
    console.log("Server running at 8080")
})