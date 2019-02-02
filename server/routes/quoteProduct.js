const express = require('express')
const QuoteProduct = require('../controllers/quoteProduct.js');

const validateToken = require('../utils').validateToken;

const quoteProductRouter = express.Router();

quoteProductRouter.route("/getByQuoteId").get(validateToken, QuoteProduct.getByQuoteId);

module.exports = quoteProductRouter;