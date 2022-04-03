const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.authenticateUser = async function(req , res ,next){
    let token = req.cookies.accessToken;
    if(!token) return res.status(400).json({error : "token not provided"})
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