var nodemailer = require('nodemailer');
// const creds = require('./mail');


function trans(){
// var transporter = nodemailer.createTransport("SMTP",transport)
var smtpTransport = nodemailer.createTransport("smtps://reminder@somiconveyor.com:"+encodeURIComponent('reminder') + "@mail.somiconveyor.com:465");
smtpTransport.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages'+success);
  }
});
return smtpTransport
}
module.exports = trans;
