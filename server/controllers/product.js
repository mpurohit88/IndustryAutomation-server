const Product = require("../models/product.js")

const add = function(req, res, next){
    let params = {
					name: req.body.name,
					description:req.body.description,
					unit: req.body.unit,
					hsnCode: req.body.hsnCode
			};
    const newProduct = new Product(params);

    try {
       newProduct.add().then(function(result) {
				 res.send("Success");
			 });
    } catch (err) {
			console.log("Error: ", err);
    }
};

const all = function(req, res, next){
	try {
		new Product({}).all().then(function(productList) {
			res.send(productList);
		});
 } catch (err) {
	 console.log("Error: ", err);
 }
}

module.exports = {add: add, all: all};