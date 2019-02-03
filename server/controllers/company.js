const Company = require("../models/company.js")

const register = function(req, res, next){
    let params = {
					organizationId: req.decoded.organizationId,
					createdBy: req.decoded.id,
					name: req.body.name,
					address:req.body.address,
					city: req.body.city,
					state: req.body.state,
					country: req.body.country,
                    tele: req.body.tele,
                    fax: req.body.fax,
					mobileNo:req.body.mobileNo,
					email: req.body.email,
					website: req.body.website,
					gstn: req.body.gstn,
					logo: req.body.logo,
					manufacturerOf: req.body.manufacturerOf,
			};
    const newCompany = new Company(params);

    try {
			newCompany.register().then(function() {
				new Company({}).all().then(function(companyList) {
					res.send(companyList);
				});
			});
    } catch (err) {
			console.log("Error: ", err);
    }
};

const all = function(req, res, next){
	try {
		new Company({}).all().then(function(companyList) {
			res.send(companyList);
		});
 } catch (err) {
	 console.log("Error: ", err);
 }
}

module.exports = {register: register, all: all};