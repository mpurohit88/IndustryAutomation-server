const express = require('express')
const EmailLog = require('../controllers/emailLog.js');

const validateToken = require('../utils').validateToken;

const emailLogRouter = express.Router();

emailLogRouter.route("/allLogs").get(validateToken, EmailLog.allLogs);

module.exports = emailLogRouter;