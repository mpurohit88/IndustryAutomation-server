const express = require('express')
const TermCondition = require('../controllers/termCondition');

const validateToken = require('../utils').validateToken;

const termConditionRouter = express.Router();

termConditionRouter.route("/getTermCondition").get(validateToken, TermCondition.getTermCondition);
termConditionRouter.route("/updateTermCondition").post(validateToken, TermCondition.updateTermCondition);

module.exports = termConditionRouter;