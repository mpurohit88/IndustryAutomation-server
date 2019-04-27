const EmailLog = require("../models/emailLog")

const allLogs = function (req, res, next) {
  try {
    if (req.decoded.role === 'admin') {
      new EmailLog({}).AllLogs().then(function (errorLogs) {
        res.send(errorLogs);
      });
    } else {
      res.send({ 'msg': 'Not Authorized' });
    }
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { allLogs: allLogs };