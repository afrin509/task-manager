// const express=require("express");
// const router=new express.Router();
// const Task = require("../models/task");


//   router.post("/tasks", async (req, res) => {
//     console.log("req body", req.body);
//     const task = new Task(req.body);
//     // Task
//     //   .save()
//     //   .then(() => {
//     //     // console.log("task",task);
//     //     res.status(201).send(Task);
//     //   })
//     //   .catch((err) => {
//     //     console.log(" i am inside catch block", err);
  
//     //     res.status(400).send(err);
//     //   });
//     try {
//       await task.save();
//       //  if any pblm arises while savng the Task it will be in caught in catch block
//       res.status(201).send(task);
//     } catch (e) {
//       res.status(404).send(e);
//     }
//   });
//   router.get("/tasks", async (req, res) => {
 
//     try {
//       const tasks = await Task.find({});
//       //  if any pblm arises while savng the Task it will be in caught in catch block
//       res.status(201).send(tasks);
//     } catch (e) {
//       res.status(500).send(e);
//     }
//   });
//   router.get("/tasks/:id", async (req, res) => {
//     //  req.params{
//     //     "_id":
//     //  }
//     const _id = req.params.id;
//     // Task.findById(_id)
//     //   .then((Task) => {
//     //     if (!Task) {
//     //       return res.status(404).send("Task is not found");
//     //     }
//     //     res.send(Task);
//     //   })
//     //   .catch((e) => {
//     //     res.status(500).send(e);
//     //   });
  
//     try {
//       const currentTask = await Task.findById(_id);
//       if (!currentTask) return res.status(404).send("Task is not found");
//       return res.send(currentTask);
//     } catch (e) {
//       res.status(500).send(e);
//     }
//   });
//   router.patch("/tasks/:id", async (req, res) => {
   
//     try {
//       // const Task=await Task.findByIdAndUpdate(req.params.id,{name:"jessica"});
//       console.log("req",req.params.id,req.body)

//       const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
//       // console.lo
//       // update went well
//       // update got stopped because your b\validaors stopped it
//       //you did find the doc wth id to update document
//       const update=Object.keys(req.body);
//       const allowUpdates=["name","email","password","age","userName"];
//       const isvalid=update.every((update)=>allowUpdates.includes(update));

//       if(!isvalid)
//       {

//         return res.status(400).send({error:"invalid updates"})
//       }
//       if (!task) {
//         return res.status(404).send("Task with that id is not found to update");
//       }

//       console.log("task",task);
//       res.status(200).send(task);
//     } catch (e) {
//       // this status means that you did not handle the Task correctly
//       res.status(400).send(e);
//     }
//     // middle ware function like save ilantivatiki pre and next work cheyylante you have to do it in the way of pre function and save and then next function
//   });
//   router.delete('/tasks/:id',async(req,res)=>{
//     try{
//      const task=await Task.findByIdAndDelete(req.params.id);
//      if(!task)
//      {
//        return res.status(404).send();
//      }
//      res.send(task);
//     }
//     catch(e)
//     {
//      res.status(500).send();
//     }
//  })
//   module.exports=router;
const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth=require('../middleware/auth')
router.post('/tasks',auth, async (req, res) => {
    // const task = new Task(req.body)
const task=new Task({
    ...req.body,
    owner:req.user._id
})
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
// {{url}}/tasks?completed=false
// {{url}}/tasks?limit=10&skip=20
 // {{url}}/tasks?completed=true&limit=2&skip=4  for getting 3 page of limit 2 u will  get index 5,6
 //{{url}}/tasks?sortBy=createdAt:desc

// whatevery querystrings you are getting from url it will be always in the form of string so you have to convert them on your own to number boolean
router.get('/tasks', auth,async (req, res) => {
    try {
        // const tasks = await Task.find({owner:req.user._id})
        // await req.user.populate('tasks');
       const match={};
       if( req.query.completed)
       {
        match.completed=req.query.completed=="true"
       }
       const sort={};
       if(req.query.sortBy)
       {
        let arr=req.query.sortBy.split(":")[1];
        if(arr=="desc")
        sort.createdAt=-1;
        else
        sort.createdAt=1;

       }
    //    if you did not provide any other query.complelted then it will print all idk ,ie if match is empty it shows up everyobject
        await req.user.populate({
            path:"tasks",
          match,
          options:{
            // limit:2,
            limit:parseInt(req.query.limit),
            // but what i found out that we cant use both completted and limit simlutanously ,done through  symbol in b/w
            skip:parseInt(req.query.skip),
            // this will skip the first 0 docs of the collection
            // {{url}}/tasks?completed=true&limit=2&skip=4  for getting 3 page of limit 2 u will  get index 5,6
        // sort:{
        //     createdAt:-1
        //     // this give in desc order,
        //     // createdAt:+1
        //     // this give in asc order,
        // }
        sort
          }
        });
        // console.log("tasks",tasks);
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task=await Task.findOne({_id,owner:req.user._id});

        if (!task) {
            return res.status(404).send('not task is found')
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})

    
        if (!task) {
            return res.status(404).send('unable to find the task you are taking about')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()


        res.send(task)
    } catch (e) {
        console.log("err while updating task using patch,id",e);
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});


        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router