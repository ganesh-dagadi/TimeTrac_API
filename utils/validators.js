const User = require('../models/User')

module.exports.validateRegisterUser = async function(req , res , next){
    const {username , password , email} = req.body;
    if(!username || !password) return res.status(403).json({error : "Username or password missing"})
    try{
        const foundUser = await User.find({$or : [{email : email} , {username : username}]})
        if (foundUser.length > 0) return res.status(409).json({error : "Username/email is already taken"})
        next()
    }catch(err){
        next(err)
    }
}

module.exports.validateLoginUser = async function(req , res , next){
    const {username , password , email} = req.body;
    console.log(req.body)
    if(!(username || email) || !password) return res.status(403).json({error : "Username/email or password missing"})
    try{
        const user = await User.find({$or : [{username : username} , {email : email}]})
        if(user.length == 0) return res.status(404).json({error : "User not found. Please register"})
        next()
    }catch(err){
        next(err)
    }
}