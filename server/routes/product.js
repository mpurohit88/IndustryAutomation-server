const express = require('express')
const Product = require('../controllers/product.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {

    callback(null, './dist/img/product/');
  },
  filename: function (req, file, callback) {

    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      callback(null, file.originalname.split('.')[0] + "_" + Date.now() + '.' + file.originalname.split('.')[1]);
    }
  }
});
const upload = multer({ storage: storage });

const validateToken = require('../utils').validateToken;

const productRouter = express.Router();

productRouter.post('/add', validateToken, upload.single('avatar'), Product.add);
productRouter.route("/all").get(validateToken, Product.all);
productRouter.route("/detailsByCompanyId").get(validateToken, Product.detailsByCompanyId);

module.exports = productRouter;