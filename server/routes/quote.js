const express = require('express')
const Quote = require('../controllers/quote.js');

const validateToken = require('../utils').validateToken;

const quoteRouter = express.Router();

quoteRouter.route("/create").post(validateToken, Quote.create);
quoteRouter.route("/start").post(validateToken, Quote.start);
quoteRouter.route("/all").get(validateToken, Quote.all);
quoteRouter.route("/getQuoteDetail").get(validateToken, Quote.getQuoteDetail);
quoteRouter.route("/updateStatus").post(validateToken, Quote.updateStatus);
quoteRouter.route("/updateDispatchSummary").post(validateToken, Quote.updateDispatchSummary);

module.exports = quoteRouter;