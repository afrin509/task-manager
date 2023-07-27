const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  name: "kcccccccce",
  email: "rincccccccc146@gmail.com",
  password: "566652ede",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, "thisis"),
    },
  ],
};
const token = userOne.tokens[0].token;
console.log("token",token);
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// test("Sould signup a new user", async () => {
//   await request(app)
//     .post("/users")
//     .send({
//       name: "Al",
//       email: "jjjjjjjjjjjjjjjjjjj48@gmail.com",
//       password: "hbhjbbbbbbbbbbbbf",
//     })
//     .expect(201);
// });
test("should login existing user", async () => {
    console.log("inside existing user")
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});
// test("testing the logged in user", async () => {
//   await request(app)
//     .post("/users/login")
//     .send({
//       email: "dafrinhbhbvf@gmail.com",
//       password: "12223",
//     })
//     .expect(400);
// });
test("should get profile for user", async () => {
    console.log("inside get users")
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200)
});
