const express = require('express')
const Auth = require('../controllers/auth.js');

const authRouter = express.Router();

authRouter.post("/login", Auth.login);

module.exports = authRouter;