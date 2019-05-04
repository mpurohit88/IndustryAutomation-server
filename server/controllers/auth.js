const Auth = require("../models/auth.js")
const jwt = require('jsonwebtoken');

const login = function (req, res, next) {
  let params = {
    name: req.body.userName,
    password: req.body.password
  };
  const auth = new Auth(params);
  let result = {};
  let status = 201;
  try {
    auth.login().then((user) => {
      if (user && user.length > 0 && user[0].password.toString('utf8') === params.password) {
        status = 200;
        // Create a token
        const payload = { id: user[0].id, user: params.name, organizationId: user[0].organizationId, companyId: user[0].companyId, role: user[0].role };
        const options = { expiresIn: '365d', issuer: 'https://sargatechnology.com' };
        const secret = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign(payload, secret, options);

        result.token = token;
        result.status = status;
        result.result = params.name;
        result.role = user[0].role;
        result.cname = user[0].name;
        result.userName = user[0].userName;
        result.logo = user[0].logo;
      } else {
        status = 401;
        result.status = status;
        result.error = `Authentication error`;
      }

      res.status(status).send(result);
    }).catch(err => {
      console.log("Error", err)
      status = 500;
      result.status = status;
      result.error = 'Applition Error, Please contact the adminstrator.';
      res.status(status).send(result);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = { login: login };