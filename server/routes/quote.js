const express = require('express')
const Quote = require('../controllers/quote.js');

const validateToken = require('../utils').validateToken;

const quoteRouter = express.Router();

quoteRouter.route("/create").post(validateToken, Quote.create);
quoteRouter.route("/all").get(validateToken, Quote.all);

module.exports = quoteRouter;