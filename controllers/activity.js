const Activity = require('../models/Activity/Activity');
const Activitylogs = require('../models/Activity/Activitylogs');
const User = require('../models/User');

module.exports.createActivity = async function(req , res , next){
    try{
        const activity = await Activity.create(req.body);
        const user = await User.findById(req.user._id);
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