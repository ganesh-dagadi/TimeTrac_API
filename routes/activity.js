const express = require('express');
const {authenticateUser} = require('../middleware/auth')
const router = express.Router();
const {createActivity , getUserActivities , editActivity, deleteActivity} = require('../controllers/activity');
const { validateCreateActivity  ,validateEditActivity} = require('../utils/validators');

router.post('/:username/activity' , authenticateUser , validateCreateActivity , createActivity);

router.get('/:username/activity' , authenticateUser , getUserActivities);

router.put('/:username/activity/:id' , authenticateUser , validateEditActivity, editActivity)

router.delete('/:username/activity/:id' , authenticateUser , deleteActivity);

module.exports = router