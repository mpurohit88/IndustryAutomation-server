const express = require('express')
const ActivityTaskHist = require('../controllers/activityTaskHist.js');

const validateToken = require('../utils').validateToken;

const activityTaskHistRouter = express.Router();

activityTaskHistRouter.route("/done").post(validateToken, ActivityTaskHist.done);

module.exports = activityTaskHistRouter;