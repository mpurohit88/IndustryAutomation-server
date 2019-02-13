const express = require('express')
const Customer = require('../controllers/customer.js');

const validateToken = require('../utils').validateToken;

const customerRouter = express.Router();

customerRouter.route("/add").post(validateToken, Customer.add);
customerRouter.route("/all").get(validateToken, Customer.all);
customerRouter.route("/contactList").get(validateToken, Customer.contactList);

module.exports = customerRouter;