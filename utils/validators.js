const User = require('../models/User')

module.exports.validateRegisterUser = async function(req , res , next){
    const {username , password} = req.body;
    if(!username || !password) return res.status(403).json({error : "Username or password missing"})
    try{
        const foundUser = await User.find({username : username});
        if (foundUser.length > 0) return res.status(409).json({error : "Username is already taken"})
        next()
    }catch(err){
        next(err)
    }
}

module.exports.validateLoginUser = async function(req , res , next){
    const {username , password} = req.body;
    if(!username|| !password) return res.status(403).json({error : "Username or password missing"})
    try{
        const user = await User.find({username : username});
        if(user.length == 0) return res.status(404).json({error : "User not found. Please register"})
        next()
    }catch(err){
        next(err)
    }
}

module.exports.validateCreateActivity = async function(req , res , next){
    const {title} = req.body;
    if(!title) return res.status(403).json({error: "Title not provided"});
    try{
        let user = await User.findById(req.user._id);
        for(let i = 0 ; i < user.activities.length ; i++){
            if(user.activities[i].title == title) return res.status(409).json({error : "Activity already exists."})
        }
        next()
    }catch(err){
        next(err)
    }
}


module.exports.validateEditActivity = async function(req , res , next){
    const {title} = req.body;
    try{
        let user = await User.findById(req.user._id);
        for(let i = 0 ; i < user.activities.length ; i++){
            if(user.activities[i].title == title) return res.status(409).json({error : "Activity already exists."})
        }
        next()
    }catch(err){
        next(err)
    }
}