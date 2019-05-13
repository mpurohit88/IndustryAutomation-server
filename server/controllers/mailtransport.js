var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var mailAccountUser = 'mpurohit88@gmail.com'
var mailAccountPassword = 'Compozed@123#'

var transport = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  tls: { rejectUnauthorized: false },
  auth: {
    user: mailAccountUser,
    pass: mailAccountPassword
  }
}))

module.exports = { serverTrans: transport };
