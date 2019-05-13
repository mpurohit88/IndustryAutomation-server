const express = require('express')
const Reminder = require('../controllers/reminder.js');

const validateToken = require('../utils').validateToken;

const reminderRouter = express.Router();

reminderRouter.route("/allReminders").get(validateToken, Reminder.allReminders);

module.exports = reminderRouter;