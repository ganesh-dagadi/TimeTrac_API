const mongoose = require('mongoose');

const LogletSchema = new mongoose.Schema({
    startTime : {type : Date},
    duration : {type : Number , required : true},
    isCompleted : {type : Boolean , default : false},
})

const ActivityLogSchema = new mongoose.Schema({
    title : String,
    loglets : [LogletSchema],
    parentActivity : {type : mongoose.Schema.Types.ObjectId, required : true},
    owner : {type : mongoose.Schema.Types.ObjectId , required : true}
})

module.exports = mongoose.model('activitylog' , ActivityLogSchema);