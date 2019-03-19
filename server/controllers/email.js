const { serverTrans } = require('./mailtransport');
const nodemailer = require('nodemailer');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const ActviityTaskHist = require("../models/activityTaskHist");
const EmailConfig = require("../models/emailConfig");
const TaskEmail = require("../models/taskEmail");
const Schedule = require("../models/schedule");

const send = function (req, res, next) {
  let params = {
    createdBy: req.decoded.id,
    task_id: req.body.taskId,
    subject: req.body.message.subject,
    body: req.body.message.body,
    quoteId: req.body.quoteId
  };

  const params1 = {
    createdBy: req.decoded.id,
    scheduleId: undefined,
    task_id: req.body.taskId,
    company_id: req.decoded.companyId,
    subject: req.body.message.subject,
    message_body: req.body.message.body,
    next_reminder_date: new Date(),
    from_address: req.body.message.from,
    to_address: req.body.message.to,
    is_reminder: false,
    frequency: 0,
    time: 0
  };

  const newSchedule = new Schedule(params1);

  if (process.env.NODE_ENV === 'development') {
    new TaskEmail(params).add().then(() => {
      params.task_id = req.body.nextTaskId;
      new TaskEmail(params).add().then(() => {
        newSchedule.add().then(function (result) {
          new ActviityTaskHist().complete(req.body.taskId).then(() => {
            if (req.body.nextTaskId) {
              new ActviityTaskHist().update(req.body.nextTaskId).then(() => {
                new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                  res.status(200).send({ tasks: tasks });
                });
              });
            } else {
              new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                res.status(200).send({ tasks: tasks });
              });
            }
          });
        });
      });
    });
  } else {
    new TaskEmail(params).add().then(() => {
      params.task_id = req.body.nextTaskId;
      new TaskEmail(params).add().then(() => {
        newSchedule.add().then(function (result) {
          new ActviityTaskHist().complete(req.body.taskId).then(() => {
            if (req.body.nextTaskId) {
              new ActviityTaskHist().update(req.body.nextTaskId).then(() => {
                new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                  res.status(200).send({ tasks: tasks });
                });
              });
            } else {
              new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
                res.status(200).send({ tasks: tasks });
              });
            }
          });
        });
      });
    });
  }
};

module.exports = { send: send };