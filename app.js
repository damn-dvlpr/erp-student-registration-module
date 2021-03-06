const express=require('express');
var mongoose=require("mongoose");
var bodyParser=require('body-parser');
require('mongoose-type-email');
const fs=require("file-system");
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid';
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/views'));

// Logging

app.use(function(req,res,next){
    var date=Date(Date.now()).toString();
    console.log(date+ ` ${req.method} ${req.originalUrl} \n`);
    // if(req.originalUrl=="/shop"&&req.method=="POST"){
    //     console.log(res.body.returnedData);
    // }
    fs.appendFile('./log/logs.txt',
    date + ` ${req.method} ${req.originalUrl} \n`
    , function(err) {
        if(!err){
            next();
        }
        else console.log(err);
    });
});

// Schemas

mongoose.connect("mongodb://localhost:27017/students");
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
var Guardian=mongoose.model("GuardianSchema",GuardianSchema);
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
    guardianInformation:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"GuardianSchema"
    }
});
var Personal=mongoose.model("PersonalSchema",PersonalSchema);

// Routes

app.get("/",function(req,res){
    res.redirect("/register");
});
app.get("/register",function(req,res){
    res.render("register.ejs");
});
app.post("/register",function(req,res){
    var student_info=req.body;
    // console.log(req.body);
    Guardian.create(student_info,function(err,returnedGuardianData){
        if(err){
            console.log(err);
        }else{
            Personal.create(student_info,function(err,returnedPersoanlData){
                if(err){
                    console.log(err)
                }else{
                    returnedPersoanlData.guardianInformation=returnedGuardianData;
                    returnedPersoanlData.save();
                    console.log(returnedPersoanlData);
                    res.status(200).json(returnedPersoanlData);
                }
            });
        }
    });
});
app.listen(8080,function(){
    console.log("Server running at 8080")
})