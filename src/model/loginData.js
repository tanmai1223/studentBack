const mongoose=require("mongoose");

const LoginSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const LoginData=mongoose.model("LoginData",LoginSchema)

module.exports = LoginData;