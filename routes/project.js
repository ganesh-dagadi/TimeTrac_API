const express = require('express');
const {authenticateUser} = require('../middleware/auth')
const router = express.Router();

router.get('/' , authenticateUser , (req , res)=>{
    res.status(200).json({msg : "You just accessed a protected route"})
})

module.exports = router