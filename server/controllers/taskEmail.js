const TaskEmail = require("../models/taskEmail");

const getEmailBody = function (req, res, next) {
  new TaskEmail({}).getEmailBody(req.query.task_id).then(function (body) {
    res.status(200).send({ body: body });
  });
};

module.exports = { getEmailBody: getEmailBody };