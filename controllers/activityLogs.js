const ActivityLogs = require('../models/Activitylogs');
const mongoose = require('mongoose')
const User = require('../models/User')


module.exports.createLog = async function(req , res , next){
    try{  
        if(!req.body.repeatsOn){  // The log does not repeat
           let data = {
               title : req.body.title,
               parentActivity : req.body.parentActivity,
               owner : req.user._id,
               loglets : [
                   {
                       startTime : req.body.startTime,
                       duration : req.body.duration,
                       isCompleted : false
                   }
               ]
           }
            const newLog = await ActivityLogs(data);
            const user = await User.findById(req.user._id);
            user.logs.push(newLog);
            await user.save();
            return res.status(200).json({newLog : newLog});
        }else{
            const timeNow = new Date(req.body.startTime); 
            const today = timeNow.getDay();  // Sunday - Saturday (0 - 6)
           
                let todayIndex = req.body.repeatsOn.indexOf(today);
                let dayDiff = []; // array containing number of days between repeat days.
                for(let i = 0 ; i < req.body.repeatsOn.length ; i++){
                    if(i == req.body.repeatsOn.length-1){  // find the number of days between last element of repeatsOn and first element of RepeatsOn
                        dayDiff[i] = ((7-req.body.repeatsOn[i]) + req.body.repeatsOn[0])
                        continue
                    }
                    dayDiff[i] = req.body.repeatsOn[i+1] - req.body.repeatsOn[i];
                }
                const dayDiffLong = []; // difference between days till end of number of repeats.
                for(let j = 0 ; j < req.body.numOfRepeats ; j++){
                    dayDiffLong[j] = dayDiff[todayIndex];
                    if(todayIndex == (dayDiff.length - 1)) {
                        todayIndex = 0;
                        continue
                    }
                    ++todayIndex;
                }
                    let data = {
                        title : req.body.title,
                        parentActivity : req.body.parentActivity,
                        owner : req.user._id,
                        loglets : [
                            {
                                startTime : req.body.startTime,
                                duration : req.body.duration,
                                isCompleted : false
                            }
                        ]
                    }

                    let nowTime = new Date(req.body.startTime);
                    for(let i = 0 ; i < dayDiffLong.length ; i++){
                        let nextTime = Date.parse(nowTime) + (86400000 * dayDiffLong[i]);
                        nowTime = new Date(nextTime);
                        data.loglets.push(
                            {
                                startTime : nextTime,
                                duration : req.body.duration,
                                isCompleted : false
                            }
                        )
                    }
                    const newLog = await ActivityLogs.create(data);
                    const user = await User.findById(req.user._id);
                    user.logs.push(newLog);
                    await user.save();
                    res.status(200).json({newLog : newLog})
        }
    }catch(err){
        next(err)
    }
}

module.exports.getLogs = async function(req, res , next){

    try{
        let {duration} = req.query;
   
        User.findById(req.user._id).populate('logs').exec(function(err , user){
            if(err) return next(err);
            let logs = user.logs;
            const resLogs = [];

            if(duration == "1d"){
                let todayStart = new Date();
                todayStart.setHours(0 ,0 , 0 ,0);
                const todayEnd = new Date();
                todayEnd.setHours(23 , 59 , 59 , 999);
                logs.forEach(log=>{
                    log.loglets.forEach(loglet=>{
                        if(Date.parse(loglet.startTime) >= todayStart && Date.parse(loglet.startTime) <= todayEnd){
                            const logletobj = {
                                title : log.title,
                                parentActivity : log.parentActivity,
                                parentLog : log._id,
                                log : loglet
                            }
                            resLogs.push(logletobj)
                        }
                    })
                })
            }else if (duration == '7d'){
                let start = Date.now() - (7 * 86400000);
                logs.forEach(log=>{
                    log.loglets.forEach(loglet=>{
                        if(Date.parse(loglet.startTime) >= start && Date.parse(loglet.startTime) <= Date.now()){
                            const logletobj = {
                                title : log.title,
                                parentActivity : log.parentActivity,
                                parentLog : log._id,
                                log : loglet
                            }
                            resLogs.push(logletobj)
                        }
                    })
                })
            }else if(duration == '1m'){
                let start = Date.now() - (30 * 86400000);
                logs.forEach(log=>{
                    log.loglets.forEach(loglet=>{
                        if(Date.parse(loglet.startTime) >= start && Date.parse(loglet.startTime) <= Date.now()){
                            const logletobj = {
                                title : log.title,
                                parentActivity : log.parentActivity,
                                parentLog : log._id,
                                log : loglet
                            }
                            resLogs.push(logletobj)
                        }
                    })
                })
            }else if(duration == '6m'){
                let start = Date.now() - (180 * 86400000);
                logs.forEach(log=>{
                    log.loglets.forEach(loglet=>{
                        if(Date.parse(loglet.startTime) >= start && Date.parse(loglet.startTime) <= Date.now()){
                            const logletobj = {
                                title : log.title,
                                parentActivity : log.parentActivity,
                                parentLog : log._id,
                                log : loglet
                            }
                            resLogs.push(logletobj)
                        }
                    })
                })
            }else if(duration == '1y'){
                let start = Date.now() - (365 * 86400000);
                logs.forEach(log=>{
                    log.loglets.forEach(loglet=>{
                        if(Date.parse(loglet.startTime) >= start && Date.parse(loglet.startTime) <= Date.now()){
                            const logletobj = {
                                title : log.title,
                                parentActivity : log.parentActivity,
                                parentLog : log._id,
                                log : loglet
                            }
                            resLogs.push(logletobj)
                        }
                    })
                })
            }else{
                return res.status(403).json({error : "Invalid duration"})
            }

            return res.status(200).json(resLogs);
        })
    }catch(err){
        next(err)
    }
}

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
        let {loglet_id , log_id} = req.params;
        const log = await ActivityLogs.findById(log_id);
        if(!log) return res.status(404).json({error : "Log not found"})
        if(!req.user._id.equals(log.owner)) return res.status(403).json({error : "Unauthorized"});
        log.loglets.id(loglet_id).isCompleted = true;
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
        console.log('here')
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
        const user = await User.findById(req.user._id);
        user.logs.forEach(function(log, index, logs) {
            if(log.equals(req.params.id)){
                logs.splice(index , 1);
            }
          });
        await user.save();
        return res.status(200).json({msg : "Deleted succesfully"});
    }catch(err){
        next(err)
    }
}