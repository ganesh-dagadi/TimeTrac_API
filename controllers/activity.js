const User = require('../models/User');

module.exports.createActivity = async function(req , res , next){
    try{
        let user = await User.findById(req.user._id);
        user.activities.push(req.body);
        await user.save();
        return res.status(200).json({msg : "Activity created successfully"});
    }catch(err){
        next(err);
    }
}

module.exports.getUserActivities = async function(req, res , next){
   const user = req.user;
   return res.status(200).json(user.activities);
}

module.exports.editActivity = async function(req , res,  next){
    try{
        let user = await User.findById(req.user._id);
        if(!user.activities.id(req.params.id)) return res.status(404).json({error : "Activity not found"})
        user.activities.id(req.params.id).title = req.body.title;
        await user.save();
        res.status(200).json({msg : "Successfully updated"});
    }catch(err){
        next(err)
    }
}

module.exports.deleteActivity = async function(req,res , next){
    try{
        user = await User.findById(req.user._id);
        if(!user.activities.id(req.params.id)) return res.status(404).json({error : "Activity not found"})
        user.activities.id(req.params.id).remove();
        await user.save();
        res.status(200).json({msg : "Successfully deleted"})
    }catch(err){
        next(err)
    }
}