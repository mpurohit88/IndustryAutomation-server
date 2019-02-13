const Customer = require("../models/customer.js")
const CustomerContact = require("../models/customerContact")

const add = function(req, res, next){
    let params = {
					createdBy: req.decoded.id,
					name: req.body.customer.name,
					address:req.body.customer.address,
					contactPerson: req.body.contactList,
					tele: req.body.customer.tele,
					gstn: req.body.customer.gstn,
					email: req.body.customer.email
			};
    const newCustomer= new Customer(params);

    try {
        newCustomer.add().then(function(result) {
			new CustomerContact({}).add(result, params.contactPerson).then(function() {
				if(req.decoded.role === 'admin') {
					new Customer({}).all().then(function(customerList) {
						res.send(customerList);
					});
				} else {
					new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
						res.send(customerList);
					});
				}
			});
		});
    } catch (err) {
			console.log("Error: ", err);
    }
};

const all = function(req, res, next){
	try {
		if(req.decoded.role === 'admin') {
			new Customer({}).all().then(function(customerList) {
				res.send(customerList);
			});
		} else {
			new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
				res.send(customerList);
			});
		}
 } catch (err) {
	 console.log("Error: ", err);
 }
}

const contactList = function(req, res, next){
	try {
		new CustomerContact({}).getByCustomerId(req.query.firmId).then(function(customerList) {
			res.send(customerList);
		});
		
 } catch (err) {
	 console.log("Error: ", err);
 }
}

module.exports = {add: add, all: all, contactList: contactList};