const Quote = require('../controllers/quote.js');
var trans= require('./mailtransport');
const nodemailer = require('nodemailer');
const ActviityTaskHist = require("../models/activityTaskHist")

// var mail = {
//   from: 'reminder@somiconveyor.com',
//   to: 'mpurohit88@gmail.com',  //Change to email address that you want to receive messages on
//   subject: 'Test email, please ignore',
//   // attachments: [  
//   //   {   
//   //       filename: "identitycard.jpg",
//   //       path:'./public/upload/'+pic,
         
//   //       // content: fs.createReadStream(pic)
//   //   }   ],
//   text: 'Testing'
// }
// trans().sendMail(mail, (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Sucess.....")
//   }
// });

const send = function(req, res, next){
    console.log("*********send email*******", req.body);

    var mail = {
        from: 'reminder@somiconveyor.com',
        to: 'mpurohit88@gmail.com',  //Change to email address that you want to receive messages on
        subject: 'Test email, please ignore',
        // attachments: [  
        //   {   
        //       filename: "identitycard.jpg",
        //       path:'./public/upload/'+pic,
               
        //       // content: fs.createReadStream(pic)
        //   }   ],
        text: 'Testing'
      }
    
      trans().sendMail(mail, (err, info) => {
        if (err) {
          console.log(err);
          res.status(200).send({msg:"fail"});
      } else
      {
        new ActviityTaskHist().complete(req.body.taskId).then(() => {
          if(req.body.nextTaskId) {
            new ActviityTaskHist().update(req.body.nextTaskId).then(() => {
              new ActviityTaskHist({}).getByActivityId([{id: req.body.userActivityId}]).then(function(tasks) {
                // console.log('Message sent: %s', info.messageId);
                res.status(200).send({tasks: tasks});
              });
            });
          } else {
            new ActviityTaskHist({}).getByActivityId([{id: req.body.userActivityId}]).then(function(tasks) {
              // console.log('Message sent: %s', info.messageId);
              res.status(200).send({tasks: tasks});
            });
          }
        });
      }
      
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      })
};

module.exports = {send: send};