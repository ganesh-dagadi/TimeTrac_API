const express = require('express');

let router = express.Router();

router.get('/login' , (req , res)=>{
    res.status(200).json('Success')
})
module.exports = router;