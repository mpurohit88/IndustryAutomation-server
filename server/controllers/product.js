const Product = require("../models/product.js")

const add = function (req, res, next) {
	const data = JSON.parse(req.body.data)

	let params = {
		createdBy: req.decoded.id,
		companyId: req.decoded.companyId,
		id: data.id,
		name: data.name,
		description: data.description,
		unit: data.unit,
		hsnCode: data.hsnCode,
		imgName: req.file ? req.file.filename : ''
	};
	const newProduct = new Product(params);

	try {
		if (params.id) {
			newProduct.update().then(function (result) {
				if (req.decoded.role === 'admin') {
					new Product({}).all().then(function (productList) {
						res.send(productList);
					});
				} else {
					new Product({}).allByCompanyId(req.decoded.companyId).then(function (productList) {
						res.send(productList);
					});
				}
			});
		} else {
			newProduct.add().then(function (result) {
				if (req.decoded.role === 'admin') {
					new Product({}).all().then(function (productList) {
						res.send(productList);
					});
				} else {
					new Product({}).allByCompanyId(req.decoded.companyId).then(function (productList) {
						res.send(productList);
					});
				}
			});
		}
	} catch (err) {
		console.log("Error: ", err);
	}
};

const all = function (req, res, next) {
	try {
		if (req.decoded.role === 'admin') {
			new Product({}).all().then(function (productList) {
				res.send(productList);
			});
		} else {
			new Product({}).allByCompanyId(req.decoded.companyId).then(function (productList) {
				res.send(productList);
			});
		}
	} catch (err) {
		console.log("Error: ", err);
	}
}

const detailsByCompanyId = function (req, res, next) {
	try {
		new Product({}).detailsByCompanyId(req.decoded.companyId).then(function (productList) {
			res.send(productList);
		});
	} catch (err) {
		console.log("Error: ", err);
	}
}

module.exports = { add: add, all: all, detailsByCompanyId: detailsByCompanyId };