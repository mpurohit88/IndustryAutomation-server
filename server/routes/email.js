const express = require('express')
const Email = require('../controllers/email.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (process.env.NODE_ENV === 'development') {
      callback(null, './dist/img/attachment/');
    } else {
      callback(null, './build/img/attachment/');
    }
  },
  filename: function (req, file, callback) {
    if (file.mimetype === "application/pdf" || file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      callback(null, file.originalname.split('.')[0] + "_" + Date.now() + '.' + file.originalname.split('.')[1]);
    }
  }
});
const upload = multer({ storage: storage });

const validateToken = require('../utils').validateToken;

const emailRouter = express.Router();

emailRouter.route("/send").post(validateToken, upload.array('avatar'), Email.send);

module.exports = emailRouter;