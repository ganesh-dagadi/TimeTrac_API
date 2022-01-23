const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.authenticateUser = async function(req , res ,next){
    let tokenHeader = req.headers.authorization;
    if(!tokenHeader) return res.status(400).json({error : "token not provided"})
    let token;
    if (tokenHeader.startsWith("Bearer ")){
        token = tokenHeader.substring(7, tokenHeader.length);
   } else {
      return res.status(400).json({error : "Wrong authorization header format"})
   }
   try{
       const tokenData = await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
       try{
        const user = await User.findById(tokenData.user_id);
        if(!user) return res.status(404).json({error : "User not found"});
        req.user = user
        next()
       }catch(error){
        next(error)
       }  
   }catch(err){
       res.status(401).json({error : "invalid token"})
   }
}