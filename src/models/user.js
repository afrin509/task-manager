const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      //   this feild must be present
    },
    completed: {
      type: Boolean,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      //this will make you have docs of each unique email ids
      // this property only applied after removing the old docs which are having same email ids so to make this property works i have to drop the old user collection and then create new collection having docs of unique ids
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    // this avatar agar nahi provide karenge tho when we are deploying to heroku or aws then user data will be removed from filesystem
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);
// methods are called instance methods
// userSchema.methods.getPublicProfile=function()
// {
//  const user=this;
//  const userObject=user.toObject();
//  delete userObject.password;
//  delete userObject.tokens;

//  return userObject;

// }
// this is virtual refer: that means it is not stored in database
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  // how task is related to the user
  foreignField: "owner",
  // how in the task your user has been related
});
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  // we dont want to have that large image data in json
  return userObject;
};
// if you have created any user instance then autmoatically this method is called
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  console.log("user", user, user._id.toString());
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN);
  console.log("i am inside generateAuthToken inside models", "token", token);
  user.tokens.push({ token });
  await user.save();
  return token;
};
// statics are model methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  // my approach but in bcrypt we have builtin functions that does comparision automatically
  //  const bcryptedPassword=await bcrypt.hash(password,8)
  //  if(user.password===bcryptedPassword)
  //  {
  //   return true;
  //  }
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login,Password did not match");
  }
  return user;
};
// setting up the hasing logic for password before saving the doc into db
userSchema.pre("save", async function (next) {
  const user = this;
  //  if you use aroow fun you dont have access to this inside arrow functions

  console.log("just before saving");
  //  user.save();
  if (user.isModified("password")) {
    console.log(" about to bcrypt");
    user.password = await bcrypt.hash(user.password, 8);
  }
  // {
  //     "name": "althaf",
  //     "email": "afrind@gmail.com",
  //     "password": "$2a$08$0vmLAqJEelcfUDn79ciZfeiks6uLNS11/wq0dXgJEfpO00J6f.x/m",
  //     "age": 202,
  //     "_id": "646eeab92f9cc1049387d62f",
  //     "__v": 0
  // }
  next();
});
// deleting user tasks if user is removed now
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = this;
    console.log("inside pre function of delete One", this);
    await Task.deleteMany({ owner: user._id });
    next();
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
