const nodeMailer = require('nodemailer');
const Quote = require('../controllers/quote.js');

const send = function(req, res, next){
    console.log("*********send email*******", req.body);

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'mpurohit88@gmail.com',
            pass: 'Thakurla@123'
        },
        tls:{
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: '"Mukesh Purohit" <mpurohit88@gmail.com>', // sender address
        to: 'mpurohit88@gmail.com', // list of receivers
        subject: 'subject....', // Subject line
        // text: req.body.body, // plain text body
        html: req.body.body // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }


        console.log('Message %s sent: %s', info.messageId, info.response);
            res.render('index');
        });
};

module.exports = {send: send};