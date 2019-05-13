const express = require('express')
const CurrencyType = require('../controllers/currencyType.js');

const validateToken = require('../utils').validateToken;

const currencyTypeRouter = express.Router();

currencyTypeRouter.route("/all").get(validateToken, CurrencyType.all);

module.exports = currencyTypeRouter;