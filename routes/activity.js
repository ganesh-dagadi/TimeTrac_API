const express = require('express');
const {authenticateUser} = require('../middleware/auth')
const router = express.Router();
const {createActivity , getUserActivities} = require('../controllers/activity');
const { validateCreateActivity} = require('../utils/validators');

router.post('/' , authenticateUser , validateCreateActivity , createActivity);

router.get('/' , authenticateUser , getUserActivities);

module.exports = router