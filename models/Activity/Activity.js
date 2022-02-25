const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title : {type : String , required : true},
    color : {type : String, default : "blue"},
    logs  : [
        {type: mongoose.Schema.Types.ObjectId , ref : "Activitylogs"}
    ],
    author : mongoose.Schema.Types.ObjectId
})



module.exports = mongoose.model('activity' , activitySchema)