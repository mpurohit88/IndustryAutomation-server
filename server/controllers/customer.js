const Customer = require("../models/customer.js")

const add = function(req, res, next){
    let params = {
					createdBy: req.decoded.id,
					name: req.body.name,
					address:req.body.address,
					contact_person: req.body.contact_person,
					tele: req.body.tele,
					gstn: req.body.gstn,
					email: req.body.email
			};
    const newCustomer= new Customer(params);

    try {
        newCustomer.add().then(function(result) {
				 res.send("Success");
			 });
    } catch (err) {
			console.log("Error: ", err);
    }
};

const all = function(req, res, next){
	try {
		new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
			res.send(customerList);
		});
 } catch (err) {
	 console.log("Error: ", err);
 }
}

module.exports = {add: add, all: all};