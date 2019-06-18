const express = require('express')
const Quote = require('../controllers/quote.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {

    if (process.env.NODE_ENV === 'development') {
      callback(null, './dist/quote/order-confirmation/');
    } else {
      callback(null, './build/quote/order-confirmation/');
    }
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.split('.')[0] + "_" + Date.now() + '.' + file.originalname.split('.')[1]);
  }
});
const upload = multer({ storage: storage });

const validateToken = require('../utils').validateToken;

const quoteRouter = express.Router();

quoteRouter.route("/create").post(validateToken, Quote.create);
quoteRouter.route("/start").post(validateToken, Quote.start);
quoteRouter.route("/all").get(validateToken, Quote.all);
quoteRouter.route("/getQuoteDetail").get(validateToken, Quote.getQuoteDetail);
quoteRouter.route("/updateStatus").post(validateToken, Quote.updateStatus);
quoteRouter.route("/updateDispatchSummary").post(validateToken, Quote.updateDispatchSummary);
quoteRouter.route("/uploadDocument").post(validateToken, upload.single('avatar'), Quote.orderConfirmation);
quoteRouter.route("/getDispatchSummary").get(validateToken, Quote.getDispatchSummary);
quoteRouter.route("/sendPaymentReminder").post(validateToken, Quote.sendPaymentReminder);

module.exports = quoteRouter;