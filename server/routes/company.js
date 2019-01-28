const express = require('express')
const Company = require('../controllers/company.js');

const validateToken = require('../utils').validateToken;

const companyRouter = express.Router();

companyRouter.route("/register").post(validateToken, Company.register);
companyRouter.route("/all").get(validateToken, Company.all);

module.exports = companyRouter;