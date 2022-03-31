const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validateCreateLog } = require('../utils/validators');
const {createLog , getLogs , getOneLog, markLogComplete , editLog , deleteLog} = require('../controllers/activityLogs');



let router = express.Router();

router.post('/' , authenticateUser, validateCreateLog , createLog);
router.get('/' , authenticateUser , getLogs)
router.get('/:id' , authenticateUser , getOneLog)
router.get('/:id/complete' , authenticateUser , markLogComplete)
router.put('/:id' , authenticateUser , validateCreateLog, editLog)
router.delete('/:id' , authenticateUser , deleteLog);

module.exports = router