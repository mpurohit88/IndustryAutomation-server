const Product = require("../models/product.js")

const add = function(req, res, next){
    let params = {
					createdBy: req.decoded.id,
					companyId: req.decoded.companyId,
					name: req.body.name,
					description:req.body.description,
					unit: req.body.unit,
					hsnCode: req.body.hsnCode
			};
    const newProduct = new Product(params);

    try {
       	newProduct.add().then(function(result) {
					if(req.decoded.role === 'admin') {
						new Product({}).all().then(function(productList) {
							res.send(productList);
						});
					} else {
						new Product({}).allByCompanyId(req.decoded.companyId).then(function(productList) {
							res.send(productList);
						});
					}
			 });
    } catch (err) {
			console.log("Error: ", err);
    }
};

const all = function(req, res, next){
	try {
		if(req.decoded.role === 'admin') {
			new Product({}).all().then(function(productList) {
				res.send(productList);
			});
		} else {
			new Product({}).allByCompanyId(req.decoded.companyId).then(function(productList) {
				res.send(productList);
			});
		}
 } catch (err) {
	 console.log("Error: ", err);
 }
}

module.exports = {add: add, all: all};