const express = require('express')
const Email = require('../controllers/email.js');

const validateToken = require('../utils').validateToken;

const emailRouter = express.Router();

emailRouter.route("/send").post(validateToken, Email.send);

module.exports = emailRouter;