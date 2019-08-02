const Marketing = require("../models/marketing")

const getTemplate = function (req, res, next) {
  try {
    const type = req.decoded.email.indexOf('export') > -1 ? parseInt(req.body.type) + 1 : req.body.type;

    new Marketing({}).GetTemplate(req.decoded.companyId).then(function (errorLogs) {
      res.send(errorLogs);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const sendEmail = function (req, res, next) {
  try {
    new Marketing({}).SendEmail(req.body, req.decoded.companyId, req.decoded.id).then(function () {
      res.send("success");
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { getTemplate: getTemplate, sendEmail: sendEmail };