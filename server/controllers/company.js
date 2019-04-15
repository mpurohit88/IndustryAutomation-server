const Company = require("../models/company.js")

const register = function (req, res, next) {
	const data = JSON.parse(req.body.data)

	let params = {
		id: data.id,
		organizationId: req.decoded.organizationId,
		createdBy: req.decoded.id,
		name: data.name,
		address: data.address,
		city: data.city,
		state: data.state,
		country: data.country,
		tele: data.tele,
		fax: data.fax,
		mobileNo: data.mobileNo,
		email: data.email,
		website: data.website,
		gstn: data.gstn,
		logo: req.file ? req.file.filename : '',
		manufacturerOf: data.manufacturerOf,
	};
	const newCompany = new Company(params);

	try {
		if (params.id) {
			newCompany.update().then(function () {
				new Company({}).all().then(function (companyList) {
					res.send(companyList);
				});
			});
		} else {
			newCompany.register().then(function () {
				new Company({}).all().then(function (companyList) {
					res.send(companyList);
				});
			});
		}
	} catch (err) {
		console.log("Error: ", err);
	}
};

const getById = function (req, res, next) {
	try {
		if (req.decoded.role === 'admin') {
			res.send('');
		} else {
			new Company({}).getById(req.decoded.companyId).then(function (companyData) {
				res.send(companyData[0].email);
			});
		}
	} catch (err) {
		console.log("Error: ", err);
	}
}

const all = function (req, res, next) {
	try {
		new Company({}).all().then(function (companyList) {
			res.send(companyList);
		});
	} catch (err) {
		console.log("Error: ", err);
	}
}

module.exports = { register: register, all: all, getById: getById };