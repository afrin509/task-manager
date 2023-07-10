const jwt=require('jsonwebtoken');
const User=require('../models/user');

const auth=async(req,res,next)=>{
   try{
      // console.log("req headers",req.header(''),req)
    
     const token=req.header('Authorization').replace("Bearer ","");
     console.log("token inside auth of user",token);
    //  console.log("token");
    const decoded=jwt.verify(token,process.env.JWT_TOKEN)
    console.log("decoded",decoded);
    const user=await User.findOne({_id:decoded._id,"tokens.token":token});
    if(!user)
    {
      throw new Error();
    }
    req.token=token;
    req.user=user;
    console.log("token IN ",token);
    next();
    // return res.send("hello");
    return user;
   }
   catch(e)
   {
      console.log("err",e);
    res.status(401).send({error:"Please Authenticate"})
   }
}
module.exports=auth;