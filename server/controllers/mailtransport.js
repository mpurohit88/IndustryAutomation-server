var nodemailer = require('nodemailer');
// const creds = require('./mail');
const aws = require('aws-sdk');

let s3 = new aws.S3({
  user: process.env.user,
  pass: process.env.pass
});

function trans(){
  // var transporter = nodemailer.createTransport("SMTP",transport)
  var smtpTransport = nodemailer.createTransport({
    debug: true,
    port: 25,
    host: "mail.somiconveyor.com",
    secureConnection: false, // use SSL
    // tls: {cipher:'SSLv3'},
    auth: {
      user: s3.user,
      pass: s3.pass
    },
    tls: {
        rejectUnauthorized: false
    }
  })

  return smtpTransport
}
module.exports = trans;
