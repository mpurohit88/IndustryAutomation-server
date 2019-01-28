const express = require('express')
const Product = require('../controllers/product.js');

const validateToken = require('../utils').validateToken;

const productRouter = express.Router();

productRouter.route("/add").post(validateToken, Product.add);
productRouter.route("/all").get(validateToken, Product.all);

module.exports = productRouter;