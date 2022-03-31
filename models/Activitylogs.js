const mongoose = require('mongoose');


const ActivityLogSchema = new mongoose.Schema({
    title : String,
    startTime : {type : Date , default : Date.now},
    duration : {type : Number , required : true},
    repeatsOn : [{type : String}],
    numOfRepeats : Number,
    isCompleted : {type : Boolean , default : false},
    parentActivity : {type : mongoose.Schema.Types.ObjectId, required : true},
    owner : {type : mongoose.Schema.Types.ObjectId , required : true}
})

module.exports = mongoose.model('activitylog' , ActivityLogSchema);