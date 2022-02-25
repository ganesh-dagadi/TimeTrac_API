const express = require('express');
const {authenticateUser} = require('../middleware/auth')
const router = express.Router();
const {createActivity , getUserActivities , editActivity, deleteActivity} = require('../controllers/activity');
const { validateCreateActivity  ,validateEditActivity} = require('../utils/validators');

router.post('/' , authenticateUser , validateCreateActivity , createActivity);

router.get('/' , authenticateUser , getUserActivities);

router.put('/:id' , authenticateUser , validateEditActivity, editActivity)

router.delete('/:id' , authenticateUser , deleteActivity);

module.exports = router