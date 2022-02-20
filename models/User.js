const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    username : {type : String , required : true },
    password : {type : String , required : true},
    email    : String,
    isEmailVerified : {type : Boolean, default : false},
    profileImg : String,
    isUserActive : {type : Boolean , default : true},
    activities : [
        {type : mongoose.Schema.Types.ObjectId , ref : 'activity'}
    ]
})

module.exports = mongoose.model('user' , UserSchema);