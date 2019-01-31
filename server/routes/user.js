const express = require('express')
const User = require('../controllers/user.js');

const validateToken = require('../utils').validateToken;

const userRouter = express.Router();

userRouter.route("/register").post(validateToken, User.register);
userRouter.route("/all").get(validateToken, User.all);

module.exports = userRouter;