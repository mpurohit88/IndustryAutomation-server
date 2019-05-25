const express = require('express')
const TermCondition = require('../controllers/termCondition');

const validateToken = require('../utils').validateToken;

const termConditionRouter = express.Router();

termConditionRouter.route("/getTermCondition").get(validateToken, TermCondition.getTermCondition);

module.exports = termConditionRouter;