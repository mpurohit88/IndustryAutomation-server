const express = require('express')
const Company = require('../controllers/company.js');

const validateToken = require('../utils').validateToken;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {

    if (process.env.NODE_ENV === 'development') {
      callback(null, './dist/img/company/');
    } else {
      callback(null, './build/img/company/');
    }
  },
  filename: function (req, file, callback) {

    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      callback(null, file.originalname);
    }
  }
});
const upload = multer({ storage: storage });

const companyRouter = express.Router();

companyRouter.route("/register").post(validateToken, upload.single('logo'), Company.register);
companyRouter.route("/getById").get(validateToken, Company.getById);
companyRouter.route("/all").get(validateToken, Company.all);

module.exports = companyRouter;