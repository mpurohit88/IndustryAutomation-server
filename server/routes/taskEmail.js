const express = require('express')
const TaskEmail = require('../controllers/taskEmail.js');

const validateToken = require('../utils').validateToken;

const taskEmailRouter = express.Router();

taskEmailRouter.route("/getEmailBody").get(validateToken, TaskEmail.getEmailBody);

module.exports = taskEmailRouter;