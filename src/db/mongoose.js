const mongoose = require("mongoose");
// const validator=require('validator');
// const { default: isEmail } = require("validator/lib/isemail");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
});
// creating a model with name and schema as parameters
// const User=mongoose.model('User',{
//     name:{
//        type:String
//     },
//     age:{
//         type:Number
//     }
// })
// // creating an instance of model
// const me=new User({
//     name:"Afrin",
//     age:27
// })

// me.save().then(()=>{
//       console.log(me)
// }).catch((err)=>{
//    console.log("Error!",err)
// })
const validator = require("validator");
// const Task=mongoose.model('Task',{
//     description:{
//   type:String,
//   required:true
// //   this feild must be present
//     },
//     completed:{
//       type:Boolean

//     },
//     email:{
//         type:String,required:true,
//         validate(value)
//         {
//            if(!validator.isEmail(value)){
//             throw new Error('Email is invalid')
//            }
//         }
//     },
//     age:{
//         type:Number,
//         validate(value)
//         {
//             if(value<0)
//             {
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })
// const task1=new Task({
//     description:"i am currently in abhibus",
//     completed:false,
//     age:12,
//     email:"afrin@abhibus.com"
// })
// task1.save().then((res)=>{
//     console.log("res",res)
// }).catch((err)=>{
//     console.log("error",err)
// })
