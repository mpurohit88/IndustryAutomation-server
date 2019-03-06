const { serverTrans } = require('./mailtransport');
const nodemailer = require('nodemailer');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const ActviityTaskHist = require("../models/activityTaskHist");
const EmailConfig = require("../models/emailConfig");
const TaskEmail = require("../models/taskEmail");

const send = function (req, res, next) {
  let params = {
    createdBy: req.decoded.id,
    task_id: req.body.nextTaskId,
    subject: req.body.message.subject,
    body: req.body.message.body
  };

  if (process.env.NODE_ENV === 'development') {
    var mail = {
      from: req.body.message.from,
      to: req.body.message.to,
      subject: req.body.message.subject,
      html: req.body.message.body
    }

    serverTrans.use('compile', inlineBase64({ cidPrefix: 'img_' }));
    serverTrans.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
        res.status(200).send({ msg: "fail" });
      } else {
        new TaskEmail(params).add().then(() => {
          // new ActviityTaskHist().complete(req.body.taskId).then(() => {
          //   if (req.body.nextTaskId) {
          //     new ActviityTaskHist().update(req.body.nextTaskId).then(() => {
          //       new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
          //         res.status(200).send({ tasks: tasks });
          //       });
          //     });
          //   } else {
          new ActviityTaskHist({}).getByActivityId([{ id: req.body.userActivityId }]).then(function (tasks) {
            res.status(200).send({ tasks: tasks });
          });
          // }
        });
        // })
      }
    });
  } else {
    new EmailConfig().readByCompanyId(req.decoded.companyId).then((data) => {
      var mail = {
        from: req.body.message.from,
        to: req.body.message.to,  //Change to email address that you want to receive messages on
        subject: req.body.message.subject,
        // attachments: [  
        //   {   
        //       filename: "identitycard.jpg",
        //       path:'./public/upload/'+pic,

        //       // content: fs.createReadStream(pic)
        //   }   ],
        text: req.body.message.body
      }

      serverTrans(data).sendMail(mail, (err, info) => {
        if (err) {
          console.log(err);
          res.status(200).send({ msg: "fail" });
        } else {
          new TaskEmail(params).add().then(() => {
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

              // Preview only available when sending through an Ethereal account
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
          });
        }
      })
    });
  }
};

module.exports = { send: send };