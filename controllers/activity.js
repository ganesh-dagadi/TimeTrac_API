const Activity = require('../models/Activity/Activity');
const Activitylogs = require('../models/Activity/Activitylogs');
const User = require('../models/User');

module.exports.createActivity = async function(req , res , next){
    try{
        const activity = await Activity.create(req.body);
        const user = await User.findById(req.user._id);
        activity.author = user._id;
        activity.save();
        user.activities.push(activity);
        user.save();
        return res.status(200).json({activity : activity});
    }catch(err){
        next(err);
    }
}

module.exports.getUserActivities = async function(req, res , next){
   const user = req.user;
   let activities = [];
   try{
        if(user.activities.length == 0) return res.status(200).json({activities : []});
        for(let i = 0 ; i < user.activities.length ; i++){
            const activityData = await Activity.findById(user.activities[i]);
            activities.push(activityData);
        }
        return res.status(200).json({activities : activities});
   }catch(err){
      next(err)
   }
}

module.exports.editActivity = async function(req , res,  next){
    const activity = await Activity.findById(req.params.id);
    if(!activity.author.equals(req.user._id)) return res.status(403).json({error : "Not authorized"});
    await Activity.findByIdAndUpdate(req.params.id , req.body);
    res.status(200).json({msg : "Successfully updated"});
}

module.exports.deleteActivity = async function(req,res , next){
    try{
        const activity = await Activity.findById(req.params.id);
        if(!req.user._id.equals(activity.author)) return res.status(403).json({error : "Not authorized"});
        //Delete array reference from the User's activities
        const user = await User.findById(req.user._id);
        for(let i = 0; i< user.activities.length ; i++){
            if(user.activities[i].equals(activity._id)){
                user.activities.splice(i , 1);
                user.save();
                req.user = user;
            }
        }
        await Activity.findByIdAndDelete(req.params.id);
        res.status(200).json({msg : "Successfully deleted"})
    }catch(err){
        next(err)
    }
}