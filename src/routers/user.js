const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, cancelEmail } = require("../emails/account");

router.get("/test", (req, res) => {
  res.send("from a new user file");
});

router.post("/users", async (req, res) => {
  console.log("req body inside users", req.body);
  const user = new User(req.body);
  // user
  //   .save()
  //   .then(() => {
  //     // console.log("task",task);
  //     res.status(201).send(user);
  //   })
  //   .catch((err) => {
  //     console.log(" i am inside catch block", err);

  //     res.status(400).send(err);
  //   });
  console.log("user in routers folders",user)

  try {
    await user.save();
    //  if any pblm arises while savng the user it will be in caught in catch block
    res.status(201).send(user);
  } catch (e) {
    console.log("err", e);
    res.status(404).send(e);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    //  if any pblm arises while savng the user it will be in caught in catch block
    res.status(201).send("users found");
  } catch (e) {
    res.status(500).send(e);
  }
});
// ikkada the second call back function is called route handler and first parameter is for the route path now we gonna pass a middleware function in between these two

// by adding auth after request is sent it will run quth function then it will run routehandler
// router.patch("/users/:id", async (req, res) => {
//   try {
//     // const user=await Task.findByIdAndUpdate(req.params.id,{name:"jessica"});
//     // const user = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
//     console.log("req", req.params.id);
//     // console.lo
//     // update went well
//     // update got stopped because your b\validaors stopped it
//     //you did find the doc wth id to update document
//     const update = Object.keys(req.body);
//     console.log("after update");
//     const allowUpdates = ["name", "email", "password", "age"];
//     console.log("after allowed updates");

//     const isvalid = update.every((update) => allowUpdates.includes(update));
//     console.log("after isvalid");

//     const user = await User.findById(req.params.id);
//     console.log("after user");

//     update.forEach((update) => {
//       // since update is dynamic keyword so we have to use bracket notation to check it
//       user[update] = req.body[update];
//     });
//     await user.save();
//     console.log("user1", user);

//     if (!isvalid) {
//       return res.status(400).send({ error: "invalid updates" });
//     }
//     if (!user) {
//       return res.status(404).send("User with that id is not found to update");
//     }
//     console.log("user2", user);
//     res.status(200).send(user);
//   } catch (e) {
//     // this status means that you did not handle the user correctly
//     console.log("err", e);
//     res.status(500).send(e);
//   }
// });
// for updating we need to have authentication so for that we are adding auth for this patch function
router.patch("/users/me", auth, async (req, res) => {
  try {
    // const user=await Task.findByIdAndUpdate(req.params.id,{name:"jessica"});
    // const user = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
    console.log("req", req.user._id);
    // console.lo
    // update went well
    // update got stopped because your b\validaors stopped it
    //you did find the doc wth id to update document
    const update = Object.keys(req.body);
    console.log("after update");
    const allowUpdates = ["name", "email", "password", "age"];
    console.log("after allowed updates");

    const isvalid = update.every((update) => allowUpdates.includes(update));
    console.log("after isvalid");

    const user = await User.findById(req.user._id);

    update.forEach((update) => {
      // since update is dynamic keyword so we have to use bracket notation to check it
      user[update] = req.body[update];
    });
    await user.save();
    console.log("user1", user);

    if (!isvalid) {
      return res.status(400).send({ error: "invalid updates" });
    }
    if (!user) {
      return res.status(404).send("User with that id is not found to update");
    }
    res.status(200).send(user);
  } catch (e) {
    // this status means that you did not handle the user correctly
    console.log("err", e);
    res.status(500).send(e);
  }
});

// router.delete("/users/:id",auth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });
// to delete the logged user profile by themseleves

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log("user in user.js",user);
    // from the user model file you have written a custom function findByCredentials and you will get the user if you have entered proper details else you will get the error
    const token = await user.generateAuthToken();
    console.log("inside users login", "token", token);

    //this will generate tokens
    sendWelcomeEmail(user.email, user.name);

    res.send({ user: user, token: token });
    // res.send({user:user.getPublicProfile(), token: token})
    // we can add a custom defined funtion that has our requirement
    // userSchema.methods.getPublicProfile = function () {
    //   const user = this;
    //   const userObject = user.toObject();
    //   delete userObject.password;
    //   delete userObject.tokens;

    //   return userObject;
    // };
  } catch (e) {
    console.log("err", e);
    res.status(400).send(e);
  }
});
// whenever we are sending the data back to the user we dont have to send password and tokens visible in the response
router.post("/users/logout", auth, async (req, res) => {
  // this will only work if user atleast has logged in one device
  // in auth={.js we are using user on the request which can be accessed later}
  // in auth we gonna add one more thing in req that is token
  try {
    req.user.tokens = req.user.tokens.filter((userToken) => {
      return userToken.token != req.token;
    });
    // the above code only logsout the last user but if you want to remove all user tokens then you can just empty it

    await req.user.save();
    console.log("req.user", req.user);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.post("/users/logoutall", auth, async (req, res) => {
  // this will only work if user atleast has logged in one device
  // in auth={.js we are using user on the request which can be accessed later}
  // in auth we gonna add one more thing in req that is token
  try {
    req.user.tokens = [];
    // the above code only logsout the last user but if you want to remove all user tokens then you can just empty it

    await req.user.save();
    console.log("req.user", req.user);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e)
  }
});
router.get("/users", auth, async (req, res) => {
  try {
    const user = await User.find({});
    //  if any pblm arises while savng the user it will be in caught in catch block
    // const token = await user.generateAuthToken();
    // console.log("users", user, "token", token);

    res.status(201).send(user);
  } catch (e) {
    console.log("r", e);
    res.status(500).send(e);
  }
  console.log("inside users");
  // 6471ee4a96f077910e9e3a27
});
router.get("/users/me", auth, async (req, res) => {
  
  res.send(req.user);
});
router.get("/users/:id", async (req, res) => {
  //  req.params{
  //     "_id":
  //  }
  const _id = req.params.id;
  // User.findById(_id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send("User is not found");
  //     }
  //     res.send(user);
  //   })
  //   .catch((e) => {
  //     res.status(500).send(e);
  //   });

  try {
    const currentUser = await User.findById(_id);
    if (!currentUser) return res.status(404).send("User is not found");
    return res.send(currentUser);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    console.log("req.user", req.user);

    // const user = await User.findByIdAndDelete(req.user._id);
    // console.log("user before deleting", user);

    // if (!user) {
    //   return res.status(404).send("No user with the provided id is found");
    // }
    await req.user.deleteOne();
    cancelEmail(req.user.email, req.user.name);
    res.status(200).send(req.user);

    // res.send(req.user);
  } catch (e) {
    console.log("err", e);
    res.status(500).send(e);
  }
});
// ab hamare paas auth function hein so we have access of user info from req.user
// router for login, find user by their email and password
const upload = multer({
  // dest: "avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(".(jpg|jpeg|png)$")) {
      return cb(new Error("Please upload a jpg,jpeg,png"));
    }
    //  if we want to allow othre extension we can use regex like \.(doc|docx)$ here backslach .  helps in going to the char where you fnd first . and then we have doc|docx select any of above it will match and $ suggest that do |docx should end at last not in anywhere in middle means .docxopopo   not a ce
    //  if it is pdf accept it
    cb(undefined, true);
  },
  //dest is used for destination and images that represent the shortcut for name of the folder where we want to upload files
});
// for uploading images we need to use post
// we gonna use upload dantlo we have a method called single which is used as middleware
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // when perfect routes matched it will go and check for upload option inside params then whatever it got from upload from req.body it will set to
    //  images folder as provideed in the upload option
    // console.log("req.file.buffer", req.file.buffer); this will give binary data

    // now using sharp to convert large files of images into jpg or png formats
    // const pngformat=await sharp(req.file.buffer).png();
    // this converts file from buffer to png
    // const buffer=await sharp(req.file.buffer).png().toBuffer();
    // it converts buffer to png then to buffer
    // const buffer = await sharp(req.file.buffer)
    //   .resize({ width: 250, height: 250 })
    //   .png()
    //   .toBuffer();
    // you can resize the image as well
    // console.log("1",Buffer.byteLength(req.file.buffer)); size of the file:224009

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    // ye actually buffer return karega but iska jo image type hein png
    // console.log("2",Buffer.byteLength(buffer));  size of the file:116277 i found only use is its is decreasing the size
    console.log("2", Buffer.byteLength(buffer));
    req.user.avatar = buffer;

    await req.user.save();
    res.send({ "avatar updated succefully": req.user.avatar });
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(201).send({ "avatar updated succefully": undefined });
  } catch (e) {
    console.log("err", e);
    res.status(500).send(e);
  }
});
// you can directly type this router in the browser to go to this image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("user or user avatar is not found");
    }
    //  we can set th eheaders of response using key :value pair
    res.set("Content-Type", "image/png");
    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});
module.exports = router;
