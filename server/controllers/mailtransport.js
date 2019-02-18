var nodemailer = require('nodemailer');
// const creds = require('./mail');

function trans(){
  console.log("*******************UserName: ", process.env.user)
  // var transporter = nodemailer.createTransport("SMTP",transport)
  var smtpTransport = nodemailer.createTransport({
    debug: true,
    port: 25,
    host: "mail.somiconveyor.com",
    secure: true, // use SSL
    // tls: {cipher:'SSLv3'},
    auth: {
      user: process.env.user,
      pass: process.env.pass
    }
  })

  return smtpTransport
}
module.exports = trans;
