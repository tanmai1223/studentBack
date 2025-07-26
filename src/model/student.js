const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  
 rollno: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  branch:{
    type:String,
    required:true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  gmail: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  caste:{
    type:String,    
    trim:true
  },
  doj: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  rank:{
    type:String,
    required: true,
    trim: true
  },
  per10:{
    type:String,
    required: true,
    trim: true
  },
  per12:{
    type:String,
    required: true,
    trim: true
  },
  ugcgpa:{
    type:String,
    required: true,
    trim: true
  },
  ugbacklog:{
    type:String,
    required: true,
    trim: true
  },
  ugper:{
    type:String,
    required: true,
    trim: true
  },
  
});

module.exports = mongoose.model("StudentData", StudentSchema);
