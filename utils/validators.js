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

module.exports.validateCreateLog = async function(req , res, next){
    try{
        const data = req.body;
        if(!data.duration) return res.status(403).json({error : "Duration not provided"});
        if(data.repeatsOn && data.repeatsOn.length == 0) return res.status(403).json({error : "RepeatsOn is Empty"})

        data.repeatsOn.forEach(element=>{
            if(!(typeof element == 'number')) return res.status(403).json({error : "All elements in RepeatsOn must be numbers"})
        })

        if(data.repeatsOn && data.repeatsOn.length !== 0 && !data.numOfRepeats ) return res.status(403).json({error : "Repeat data insufficient"});
        if(!data.startTime) return res.status(403).json({error : "StartTime absent"});

        const startDay = new Date(data.startTime);
        if(!data.repeatsOn.includes(startDay.getDay())) return res.status(403).json({error : "Start time's day not in repeatsOn"});
        if(!data.parentActivity) return res.status(403).json({error : "Parent activity missing"});
        const user = await User.findById(req.user._id);
        if(user.activities.id(data.parentActivity) == null) return res.status(403).json({error : "parent activity not found"})
        next();
    }catch(err){
       next(err)
    }
    
}