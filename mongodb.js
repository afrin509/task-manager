const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectId } = mongodb;

const uri =
  "mongodb+srv://dafrin148:Afrindudekula321@cluster-for-afrin-mongo.qqrsvd9.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const id = new ObjectId();
// this will create the object id
console.log("getTimeStamp", id.getTimestamp());
async function run() {
  try {
    const database = client.db("test");
    const users = database.collection("users");

    //  const user= await database.collection("users").find({title:"althaf"}).toArray()
    //  console.log("user",user);
    //  to get array of documents for user
    // Update
    //  const updatePromise=users.updateMany({
    //     title:"althaf"
    //   },{
    //     $set:{
    //       title:'althaf dudekula'
    //     }
    //   })
    //   // if you dont pass callback then it will return promise
    //   updatePromise.then((result)=>{
    //           console.log("result", result)
    //   }).catch((err)=>{
    //     console.log("error inside catch",err);
    //   })
    //delete
    const deletePromise = users
      .deleteMany({ title: "afrin" })
      .then((result) => {
        console.log("result", result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  } catch (err) {
    console.log(err);
  }
}

run().catch(console.log("Err"), console.dir);

//creating object ids basically mongosb library will create ids
// const ObjectID=mongodb.ObjectID;
