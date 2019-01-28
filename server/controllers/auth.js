const Auth = require("../models/auth.js")
const jwt = require('jsonwebtoken');

const login = function(req, res, next){
    let params = {
                name:req.body.userName,
                password:req.body.password
			};
    const auth = new Auth(params);
    let result = {};
    let status = 201;
    try {
        auth.login().then((user) => {
            if (user && user.length > 0 && user[0].password.toString('utf8') === params.password) {
              status = 200;
              // Create a token
              const payload = { user: params.name };
              const options = { expiresIn: '2d', issuer: 'https://sargatechnology.com' };
              const secret = process.env.JWT_SECRET || 'secret';
              const token = jwt.sign(payload, secret, options);

              result.token = token;
              result.status = status;
              result.result = params.name;
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

module.exports = {login: login};