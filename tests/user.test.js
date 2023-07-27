const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userOneId = new mongoose.Types.ObjectId();
console.log("userOneId",userOneId)
const userOne = {
  name: "Althafncddjncjd",
  email: "zzzzzkkkkooolpppppppp36@gmail.com",
  password: "566652ede",
  _id: userOneId,
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, "thisis"),
       _id:userOneId,
    },
  ],
};
const token = userOne.tokens[0].token;
console.log("token",token);
beforeEach(async () => {
  console.log("usermodel",User);
  await User.deleteMany();
  await new User(userOne).save();
});

// test("Should signup a new user", async () => {
//  const res= await request(app)
//     .post("/users")
//     .send({
//       name: 'Andrew',
//       email: 'dasdnjnjsjn@gmail.com',
//       password: 'Mxjbsxbs',
//     }).expect(201);
//     console.log("response_body",res.body);
//     const user=await User.findById(res.body._id);
//     expect(user).not.toBeNull();
//     expect(res.body).toMatchObject({
//       user:{
//         name: 'Andrew',
//       email: 'dasdnjnjsjn@gmail.com',
//       },
//       token:user.tokens[0].token
//     })
//    expect(user.password).not.toBe('Althaf')
// });
let token1=0;
test("should login existing user", async () => {
    console.log("inside existing user")
const res= await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
      console.log("response_body",res.body);
      const user=await User.findById(userOneId);
  console.log("userone inside existing user",user);
    const usertoken2=res.body.token;
    expect(user.tokens[1].token).toBe(usertoken2);
    console.log("after loggin the existing user");
});
test("testing the logged in user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "dafrinhbhbvf@gmail.com",
      password: "12223",
    })
    .expect(400);
});
test("should get profile for user", async () => {
    console.log("inside get users")
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(200)
});
// test("should not get profile for unauthenticated user",async()=>
// {
//   console.log("inside should not get profile");
//   await request(app).get('/users/me').send().expect(401);
// })
test("Should delete Account for a user",async()=>{
  console.log("inside delete account")
  await request(app).delete('/users/me').set('Authorization',`Bearer ${token}`).send().expect(200);
})
test("Should not delete account for unathentication user",async()=>{
  await request(app).delete('/users/me').send().expect(401);
})
test('Should Upload Avatar',async()=>{
  console.log("should upload avatar")
  await request(app).post('/users/me/avatar').set('Authorization',`Bearer ${token}`).attach('avatar','tests/fixtures/profile-pic - Copy.jpg').expect(200);
  const user=await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer))
})
test('Should update valid user feilds',async()=>
{
  await request(app).patch('/users/me').set('Authorization',`Bearer ${token}`).send({name:"Afrin"}).expect(200);
  const user=await User.findById(userOneId);
  expect(user.name).toEqual('Afrin');
})
test('Should not update valid user feilds',async()=>
{
  await request(app).patch('/users/me').set('Authorization',`Bearer ${token}`).send({location:"pillow"}).expect(200);
  const user=await User.findById(userOneId);
  expect(user.name).toEqual('Althaf');
})