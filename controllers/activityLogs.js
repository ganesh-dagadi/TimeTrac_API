const Activity = require('../models/Activity/Activity');
const ActivityLogs = require('../models/Activity/Activitylogs');


module.exports.createLog = async function(req , res , next){
    const {parentActivity} = req.body;
    const activity = await Activity.findById(parentActivity);
}