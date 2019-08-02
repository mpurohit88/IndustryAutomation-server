const express = require('express')
const Marketing = require('../controllers/marketing.js');

const validateToken = require('../utils').validateToken;

const marketingRouter = express.Router();

marketingRouter.route("/getTemplate").get(validateToken, Marketing.getTemplate);
marketingRouter.route("/sendEmail").post(validateToken, Marketing.sendEmail);

module.exports = marketingRouter;