const ActivityLogs = require('../models/Activitylogs');
const User = require('../models/User')


module.exports.createLog = async function(req , res , next){
    try{
        const newLog = await ActivityLogs.create(req.body);
        const user = await User.findById(req.user._id);
        user.logs.push(newLog);
        await user.save();
        return res.status(200).json({createdLog : newLog});
    }catch(err){
        next(err);
    }
}

// module.exports.getLogs = async function(req, res , next){
//     let {duration , sort} = req.query;
// }

module.exports.getOneLog = async function(req, res ,next){
    try{
        const log = await ActivityLogs.findById(req.params.id);
        res.status(200).json({log : log})
    }catch(err){
        next(err)
    }
}

module.exports.markLogComplete = async function(req, res , next){
    try{
        const log = await ActivityLogs.findById(req.params.id);
        if(!req.user._id.equals(log.owner)) return res.status(403).json({error : "Unauthorized"});
        log.isCompleted = true;
        await log.save();
        return res.status(200).json({msg : "Marked complete"});
    }catch(err){
        next(err)
    }
}

module.exports.editLog = async function(req , res , next){
    try{
        const log = await ActivityLogs.findById(req.params.id);
        if(!req.user._id.equals(log.owner)) return res.status(403).json({error : "Unauthorized"});
        const updatedLog = ActivityLogs.findByIdAndUpdate(req.params.id , req.body);
        return res.status(200).json({updatedLog : updatedLog});
    }catch(err){
        next(err)
    }
}

module.exports.deleteLog = async function(req, res ,next){
    try{
        const log = await ActivityLogs.findById(req.params.id);
        if(!req.user._id.equals(log.owner)) return res.status(403).json({error : "Unauthorized"});
        await ActivityLogs.findByIdAndDelete(req.params.id);
        return res.status(200).json({msg : "Deleted succesfully"});
    }catch(err){
        next(err)
    }
}