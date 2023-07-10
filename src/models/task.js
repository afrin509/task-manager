// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt=require("bcryptjs")

// const taskSchema =new mongoose.Schema( {

//   userName: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     validate(value) {
//       if (value.includes("password")) {
//         throw Error("password should not be keyword 'password'");
//       }
//     },
//   },
//   task: {
//     type: String,
//   },
// });
// taskSchema.pre("save",async function(next)
// {
//   const task=this;
//   console.log("task in models",task);
//   if(task.isModified('password')){
//     task.password=await bcrypt.hash(task.password,8);

//   }
//   console.log("task in models after",task);

//   next();

// })
// const Task=mongoose.model("Task",taskSchema)
// module.exports = Task;
const mongoose = require("mongoose");

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner:{
//       type:mongoose.Schema.Types.ObjectId,
//       required:true,
//       ref:'User'
//       // this ref creates a reference to the user model
//     }

// },
// ) this is not schema it is just we are passing the object as parameter inside model

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      // this ref creates a reference to the user model
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
