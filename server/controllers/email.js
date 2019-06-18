const { serverTrans } = require('./mailtransport');
const nodemailer = require('nodemailer');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const ActviityTaskHist = require("../models/activityTaskHist");
const EmailConfig = require("../models/emailConfig");
const TaskEmail = require("../models/taskEmail");
const Schedule = require("../models/schedule");
const Quote = require("../models/quote");

const send = function (req, res, next) {
  const data = JSON.parse(req.body.data)

  let attachments = '';

  req.files.map((file) => {
    attachments = attachments === '' ? file.filename : (attachments + ',' + file.filename);
  });

  let params = {
    createdBy: req.decoded.id,
    task_id: data.taskId,
    subject: data.subject,
    body: data.body,
    quoteId: data.quoteId
  };

  const params1 = {
    createdBy: req.decoded.id,
    scheduleId: undefined,
    task_id: data.taskId,
    company_id: req.decoded.companyId,
    subject: data.subject,
    message_body: '',
    next_reminder_date: new Date(),
    from_address: data.from,
    to_address: data.to,
    cc_address: data.cc || '',
    bcc_address: data.bcc || '',
    attachments: attachments,
    is_reminder: false,
    frequency: 0,
    time: 0
  };

  const newSchedule = new Schedule(params1);

  if (process.env.NODE_ENV === 'production') {
    const mail = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.body
    }

    serverTrans.use('compile', inlineBase64({ cidPrefix: 'img_' }));
    serverTrans.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
        res.status(200).send({ msg: "fail" });
      } else {
        new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
          res.status(200).send({ tasks: tasks });
        });
      }
    });

    // new TaskEmail(params).add().then(() => {
    //   params.task_id = data.nextTaskId;
    //   new TaskEmail(params).add().then(() => {
    //     newSchedule.add().then(function (result) {
    //       // new ActviityTaskHist().complete(data.taskId).then(() => {
    //       new Quote({}).update(data.quoteId, 3).then(() => {

    //         if (data.nextTaskId) {
    //           // new ActviityTaskHist().update(data.nextTaskId).then(() => {
    //           new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
    //             res.status(200).send({ tasks: tasks });
    //           });
    //           // });
    //         } else {
    //           new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
    //             res.status(200).send({ tasks: tasks });
    //           });
    //         }
    //       });
    //     });
    //   });
    // });
    // });
  } else {
    new TaskEmail(params).InactivateEmail(data.taskId, data.nextTaskId).then(() => {
      new Schedule({}).stopAll(data.quoteId).then(() => {
        new TaskEmail(params).add().then(() => {
          params.task_id = data.nextTaskId;
          new TaskEmail(params).add().then(() => {
            newSchedule.add().then(function (result) {
              // new ActviityTaskHist().complete(data.taskId).then(() => {
              new Quote({}).update(data.quoteId, 3).then(() => {

                if (data.nextTaskId) {
                  // new ActviityTaskHist().update(data.nextTaskId).then(() => {
                  new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
                    const mail = {
                      from: data.from,
                      to: data.to,
                      subject: data.subject,
                      html: data.body
                    }

                    serverTrans.use('compile', inlineBase64({ cidPrefix: 'EmbeddedContent_' }));
                    serverTrans.sendMail(mail, (err, info) => {
                      if (err) {
                        console.log(err);
                        res.status(200).send({ msg: "fail" });
                      } else {
                        new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
                          res.status(200).send({ tasks: tasks });
                        });
                      }
                    });
                  });
                  // });
                } else {
                  new ActviityTaskHist({}).getByActivityId([{ id: data.userActivityId }]).then(function (tasks) {
                    res.status(200).send({ tasks: tasks });
                  });
                }
              });
              // });
            });
          });
        });
      });
    });
  }
};

module.exports = { send: send };