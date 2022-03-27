const mongoose = require('mongoose');


const ActivityLogSchema = new mongoose.Schema({
    description : String,
    startTime : {type : Date , default : Date.now},
    duration : Number,
    RepeatsOn : [{type : Number}],
    numberOfRepeats : Number,
    isCompleted : {type : Boolean , default : false},
    parentActivity : mongoose.objectId
})

module.exports = mongoose.model('activitylog' , ActivityLogSchema);