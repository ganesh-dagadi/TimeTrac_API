const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const RefreshToken = require('../models/auth/refreshToken')

module.exports.registerUser = async function(req, res , next){
    const {password} = req.body;
    const salt =  await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password , salt);
    try{
        const newUser = await User.create(req.body)
        res.status(200).json({user : newUser , msg : "Registered successfully. Please Login"})
    }
    catch(err){
        next(err)
    }
}

module.exports.loginUser = async function(req , res , next){
    const {password , username , email} = req.body;
    try{
        let user = await User.find({$or : [{email : email} , {username : username}]});
        user = user[0];
        if(!bcrypt.compareSync(password , user.password)) return res.status(400).json({error : "passwords dont match."})
        const accessToken = jwt.sign(
            {
                user_id : user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : 60
            }
        )

        const refreshToken = jwt.sign(
            {
                user_id : user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
        )

        try{
            await RefreshToken.create({token : refreshToken})
            res.status(200).json({user : user , auth : {accessToken : accessToken , refreshToken : refreshToken}})
        }catch(error){
            next(error)
        }
    }catch(err){
        next(err)
    }
}

module.exports.newToken = async function(req , res , next){
    let tokenHeader = req.headers.authorization;
    if(!tokenHeader) return res.status(400).json({error : "please include refreshToken in request header"})
    let token;
    if(tokenHeader.startsWith("Bearer ")){
        token = tokenHeader.substring(7 , tokenHeader.length)
    }else{
        return res.status(400).json({error : "Wrong authorization header format"})
    }
    try{
        const dbToken = await RefreshToken.find({token : token});
        if(dbToken.length == 0) return res.status(403).json({error : {msg : "Invalid token" , isRefreshTokenError : true}})
        try{
            const tokenData = jwt.verify(token , process.env.REFRESH_TOKEN_SECRET)
            const newToken = jwt.sign(
                {
                    user_id : tokenData.user_id
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn : 60
                }
            )
            res.status(200).json({auth : {accessToken : newToken}})
        }catch(error){
            res.status(403).json({error : {msg : "Invalid refresh token" , isRefreshTokenError : true}})
        }
    }catch(err){
        next(err)
    }
}

module.exports.logoutUser = async function(req , res , next){
    let tokenHeader = req.headers.authorization;
    let token;
    if(tokenHeader.startsWith("Bearer ")){
        token = tokenHeader.substring(7 , tokenHeader.length)
    }else{
        return res.status(400).json({error : "Wrong authorization header format"})
    }
    try{
        const dbToken = await RefreshToken.findOne({token : token})
        if(!dbToken) return res.status(404).json({error : "refreshToken not found in database"})
        await RefreshToken.findOneAndDelete({token : token})
        res.status(200).json({msg : "User logged out"})
    }catch(err){
        next(err)
    }
}