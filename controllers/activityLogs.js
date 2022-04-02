const ActivityLogs = require('../models/Activitylogs');
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
                       startTime : req.body.startTime ? req.body.startTime : Date.now(),
                       duration : req.body.duration,
                       isCompleted : false
                   }
               ]
           }
            const newLog = await ActivityLogs(data);
            return res.status(200).json({newLog : newLog});
        }else{
            const timeNow = new Date(Date.now()); 
            const today = timeNow.getDay();  // Sunday - Saturday (0 - 6)
            if(req.body.repeatsOn.includes(today)){
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
                                startTime : req.body.startTime ? req.body.startTime : Date.now(),
                                duration : req.body.duration,
                                isCompleted : false
                            }
                        ]
                    }

                    let nowTime = Date.now();
                    for(let i = 0 ; i < dayDiffLong.length ; i++){
                        let nextTime = nowTime + (86400000 * dayDiffLong[i]);
                        nowTime = nextTime;
                        data.loglets.push(
                            {
                                startTime : nextTime,
                                duration : req.body.duration,
                                isCompleted : false
                            }
                        )
                    }
                    
                    const newLog = await ActivityLogs.create(data);
                    res.status(200).json({newLog : newLog})
            }else{

            }
        }
    }catch(err){
        next(err)
    }
}

module.exports.getLogs = async function(req, res , next){
    let {duration , sort} = req.query;
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