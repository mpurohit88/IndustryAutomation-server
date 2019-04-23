const TaskEmail = require("../models/taskEmail");

const getEmailBody = function (req, res, next) {
  new TaskEmail({}).getEmailBody(req.query.task_id).then(function (body) {
    res.status(200).send({ body: body[0] });
  });
};

module.exports = { getEmailBody: getEmailBody };