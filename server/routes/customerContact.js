const express = require('express')
const CustomerContact = require('../controllers/customerContact.js');

const validateToken = require('../utils').validateToken;

const customerContact = express.Router();

customerContact.route("/quoteContactDetail").get(validateToken, CustomerContact.quoteContactDetail);

module.exports = customerContact;