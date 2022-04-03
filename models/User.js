const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title : {type : String , required : true}
})

const UserSchema  = new mongoose.Schema({
    username : {type : String , required : true },
    password : {type : String , required : true},
    email    : String,
    isEmailVerified : {type : Boolean, default : false},
    profileImg : String,
    isUserActive : {type : Boolean , default : true},
    activities : [activitySchema],
    logs : [{type : mongoose.Schema.Types.ObjectId , ref : 'Activitylog' }]
})

module.exports = mongoose.model('user' , UserSchema);