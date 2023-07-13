const express = require("express");
require("./src/db/mongoose");

// this will allow to imoprt everything from mongoose
const User = require("./src/models/user");
const Task = require("./src/models/task");
// importing user router from user file
const app = express();
const port = process.env.Port||8000;
const userRouter = require("./src/routers/user");
const taskRouter = require("./src/routers/task");
const multer = require("multer");
// this is the most popular npm library we are using for file uplaoding in nodejs
// to configure multer
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
    // this will limit the file size to be one megabyte and not more than that now if you try to uploaf >1mb say fall.jpg it shows error
  },
  // to filter based on file type
  // function fileFilter (req, file, cb) {

  //   // The function should call `cb` with a boolean
  //   // to indicate if the file should be accepted

  //   // To reject this file pass `false`, like so:
  //   cb(null, false)

  //   // To accept the file pass `true`, like so:
  //   cb(null, true)

  //   // You can always pass an error if something goes wrong:
  //   cb(new Error('I don\'t have a clue!'))

  // }
  fileFilter(req, file, cb) {
    // file mein we have all methods originalname and then endsWith wich is present in multer of npm
    //  if(!file.originalname.endsWith('.pdf'))
    //  {
    //    return cb(new Error('Please upload a PDF'))
    //   }
    if (!file.originalname.match(".(doc|docx)$")) {
      return cb(new Error("Please upload a PDF"));
    }
    //  if we want to allow othre extension we can use regex like \.(doc|docx)$ here backslach .  helps in going to the char where you fnd first . and then we have doc|docx select any of above it will match and $ suggest that do |docx should end at last not in anywhere in middle means .docxopopo   not a ce
    //  if it is pdf accept it
    cb(undefined, true);
  },

  //dest is used for destination and images that represent the shortcut for name of the folder where we want to upload files
});
// for uploading images we need to use post
// we gonna use upload dantlo we have a method called single which is used as middleware
// app.post("/upload",upload.single('upload'),(req,res)=>{
//   // when perfect routes matched it will go and check for upload option inside params then whatever it got from upload from req.body it will set to
// //  images folder as provideed in the upload option
//    res.send("image uploaded succefully");
// })
// lets just how error is passed to express by multer using demo err function
// const errMiddleware=(req,res,next)=>{
//   throw new Error('From my middleware');
// }

// app.post("/upload",errMiddleware,(req,res)=>{
//   res.send("image uploaded succefully");
// },
// // this cb function will work if you have any error by errMiddleware
// (err,req,res,next)=>{
//    res.status(400).send({error:err})
// }
//   // when perfect routes matched it will go and check for upload option inside params then whatever it got from upload from req.body it will set to
// //  images folder as provideed in the upload option

// )
// lets just how error is passed to express by multer using real file upload
app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send("image uploaded succefully");
  },
  // this cb function will work if you have any error by errMiddleware
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
  // when perfect routes matched it will go and check for upload option inside params then whatever it got from upload from req.body it will set to
  //  images folder as provideed in the upload option
);

// app.use((req,res,next)=>{
//   // console.log(req.method,req.path);
//   if(req.method=="GET")
//   {
//      res.send("get requests are disabled")
//   }
//   else
//   {
//     next();

//   }
// })
app.listen(port, () => {
  console.log("server is up on port" + port);
});
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// without middleware::if you raise the request then directly you will go to routehandler
// with middleware: if you raise request then you can use some custom defined functions where you can do validations or put som echecks and then you can pass to routes handlers
const jwt = require("jsonwebtoken");
// const bcrypt=require('bcryptjs');
const myFunction = async () => {
  // const password='Red1245';
  // const hashPassword=await bcrypt.hash(password,8);
  // // bcrypt has a method called hash that will take the password need to be bcrypted with 8 rounds of hashing algo
  // // 8 is ideal given by creator
  // // with encryption algo  we can turn the resulted string to original string where as hashing algo cannot be reversible to get back our original plain text algo
  // const isMatch=await bcrypt.compare('Red12345',hashPassword)
  // console.log("isMatch",isMatch);
  const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", {
  });
  console.log(token);
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2ODUxOTU1MjF9.D0kRYmPFSGzSWhTG9aGhOKuxRAMyuXffZOYyPf-cOVo
  // this token has middle token when we decode it as payload which consists of data we have provided and second it will give info about when it has created it
  ///first part for headers
  ///signature to verify our token
  const data = jwt.verify(token, "thisismynewcourse");
  // this data gives you  { _id: 'abc123', iat: 1685196512 } iat means issued at if and only if the secret signature string:thisismynewcourse is same as that you provided in parent
  console.log("data", data);
  // we can even add extra parameters that let us to expire the tokenn for particular time span
  // err after expiring  expiredAt: 2023-05-27T14:12:35.000Z
};

myFunction();
let pet = {
  name: "afrin",
  age: "23",
};
pet.toJSON = function () {
  return {};
};

// const router=new express.Router();
// router.get("/test",(req,res)=>{
//   res.send('this is from my other router')
// })
// it will parse jsson into object this will automatically change our request
// app.post("/users", async (req, res) => {
//   console.log("req body", req.body);
//   const user = new User(req.body);
//   // user
//   //   .save()
//   //   .then(() => {
//   //     // console.log("task",task);
//   //     res.status(201).send(user);
//   //   })
//   //   .catch((err) => {
//   //     console.log(" i am inside catch block", err);

//   //     res.status(400).send(err);
//   //   });
//   try {
//     await user.save();
//     //  if any pblm arises while savng the user it will be in caught in catch block
//     res.status(201).send(user);
//   } catch (e) {
//     res.status(404).send(e);
//   }
// });
// app.post("/tasks", async (req, res) => {
//   const task = new Task(req.body);
//   try {
//     await task.save();
//     res.status(201).send(task);
//   } catch (e) {
//     res.status(400).send(err);
//   }
//   // task
//   //   .save()
//   //   .then(() => {
//   //     res.status(201).send(task);
//   //   })
//   //   .catch((err) => {
//   //     console.log(" i am inside catch block", err);

//   //     res.status(400).send(err);
//   //   });
// });
// app.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await Task.find({});
//     res.status(201).send(tasks);
//   } catch (e) {
//     console.log("err",e);
//     res.status(500).send(e);
//   }
//   // Task.find({})
//   //   .then((users) => {
//   //     res.send(users);
//   //   })
//   //   .catch((e) => {
//   //     res.status(500).send(e);
//   //   });
// });
app.get("/app",(req,res)=>{
  res.json({message:"hello from  app"});
})
// // app.get("/users", async (req, res) => {
// //   // const user=new User(req.body);
// //   // User.find({})
// //   //   .then((users) => {
// //   //     res.send(users);
// //   //   })
// //   //   .catch((e) => {
// //   //     res.status(500).send(e);
// //   //   });
// //   try {
// //     const users = await User.find({});
// //     //  if any pblm arises while savng the user it will be in caught in catch block
// //     res.status(201).send(users);
// //   } catch (e) {
// //     res.status(500).send(e);
// //   }
// // });
// // // adding dynamic data to route handler
// // app.get("/users/:id", async (req, res) => {
// //   //  req.params{
// //   //     "_id":
// //   //  }
// //   const _id = req.params.id;
// //   // User.findById(_id)
// //   //   .then((user) => {
// //   //     if (!user) {
// //   //       return res.status(404).send("User is not found");
// //   //     }
// //   //     res.send(user);
// //   //   })
// //   //   .catch((e) => {
// //   //     res.status(500).send(e);
// //   //   });

// //   try {
// //     const currentUser = await User.findById(_id);
// //     if (!currentUser) return res.status(404).send("User is not found");
// //     return res.send(currentUser);
// //   } catch (e) {
// //     res.status(500).send(e);
// //   }
// // });
// // the below is used to update the user with id
// // app.patch("/users/:id", async (req, res) => {
// //   try {
// //     // const user=await Task.findByIdAndUpdate(req.params.id,{name:"jessica"});
// //     const user = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
// //     console.log("req",req.params.id)
// //     // console.lo
// //     // update went well
// //     // update got stopped because your b\validaors stopped it
// //     //you did find the doc wth id to update document
// //     const update=Object.keys(req.body);
// //     const allowUpdates=["name","email","password","age"];
// //     const isvalid=update.every((update)=>allowUpdates.includes(update));
// //     if(!isvalid)
// //     {
// //       return res.status(400).send({error:"invalid updates"})
// //     }
// //     if (!user) {
// //       return res.status(404).send("User with that id is not found to update");
// //     }
// //     console.log("user",user);
// //     res.status.send(user);
// //   } catch (e) {
// //     // this status means that you did not handle the user correctly
// //     res.status(400).send(e);
// //   }
// // });
// app.get("/tasks/:id", async (req, res) => {
//   const _id = req.params.id;
//   // Task.findById(_id)
//   //   .then((task) => {
//   //     if (!task) {
//   //       return res.status(404).send("User is not found");
//   //     }
//   //     res.send(task);
//   //   })
//   //   .catch((e) => {
//   //     res.status(500).send(e);
//   //   });
//   try {
//     const task1 = await Task.findById(_id);
//     if (!task1) {
//       return res.status(404).send("User is not found");
//     }
//     res.send(task1);
//   } catch {
//     res.status(500).send(e);
//   }
// });
// app.patch('/tasks/:id',async(req,res)=>{
//   const updates=Object.keys(req.body);
//   const allowedUpdates=['age'];
//   const isvalid=updates.every((update)=>allowedUpdates.includes(update));
//   if(!isvalid)
//   {
//     return res.status(400).send({error:"invalid updates"})
//   }
//   try{
//     const task=await Task.findByIdAndUpdate(req.params.id,{$set:{age:90}},{new:true,useFindAndModify:false});
//     if(!task)
//     {
//       return res.status(404).send();
//     }
//     console.log("task",task);
//     res.send(task);
//   }
//   catch(e)
//   {
//     res.status(400).send(e);

//   }

// })
// // app.delete('/users/:id',async(req,res)=>{
// //    try{
// //     const user=await User.findByIdAndDelete(req.params.id);
// //     if(!user)
// //     {
// //       return res.status(404).send();
// //     }
// //     res.send(user);
// //    }
// //    catch(e)
// //    {
// //     res.status(500).send();
// //    }
// // })
// app.delete('/tasks/:id',async(req,res)=>{
//    try{
//     const task=await Task.findByIdAndDelete(req.params.id);
//     if(!task)
//     {
//       return res.status(404).send();
//     }
//     res.send(task);
//    }
//    catch(e)
//    {
//     res.status(500).send();
//    }
// })

// const main=async()=>{
//   // const task=await Task.findById('6479e98d86307568d1402481');
//   // await task.populate('owner').execPopulate();
//   // // this now change the owner value to the particular entire user profile not just the id of the user
//   // console.log("task owner",task.owner);
//   const user=await User.findById('6479d4089eb90111e8073995');
//   if(!user){
//   await user.populate('tasks');
//   console.log(user,user.tasks);
//   }
//   // as printing this will get to know that user mein actucally tasks save nahi ho rahe hein kyunki ye virtual but if you log user.tasks then we get tasks present
// }
// main();
module.exports=app;