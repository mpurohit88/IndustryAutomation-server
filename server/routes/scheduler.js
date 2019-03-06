const express = require('express')
const Scheduler = require('../controllers/scheduler');

const validateToken = require('../utils').validateToken;

const schedulerRouter = express.Router();

schedulerRouter.route("/add").post(validateToken, Scheduler.add);
schedulerRouter.route("/getScheduleDetails").get(validateToken, Scheduler.getScheduleDetails);

module.exports = schedulerRouter;