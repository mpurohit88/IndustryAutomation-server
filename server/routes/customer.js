const express = require('express')
const Customer = require('../controllers/customer.js');

const validateToken = require('../utils').validateToken;

const customerRouter = express.Router();

customerRouter.route("/add").post(validateToken, Customer.add);
customerRouter.route("/all").get(validateToken, Customer.all);

module.exports = customerRouter;