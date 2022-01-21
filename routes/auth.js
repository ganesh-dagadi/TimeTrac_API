const express = require('express');
const {validateRegisterUser , validateLoginUser} = require('../utils/validators')
const {registerUser, loginUser , newToken, logoutUser} = require("../controllers/auth");

let router = express.Router();

router.post('/register' , validateRegisterUser , registerUser)
router.post('/login' , validateLoginUser , loginUser)
router.get('/newToken' , newToken)
router.get('/logout' , logoutUser)

module.exports = router;