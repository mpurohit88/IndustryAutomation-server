const connection = require("../lib/connection.js");
let Customer = function(params){
    this.name = params.name,
    this.address = params.address,
    this.contact_person = params.contact_person,
    this.tele = params.tele,
    this.gstn = params.gstn,
    this.email = params.email
    this.createdBy = 'mpurohi88'
    this.isActive = 1
};

Customer.prototype.add = function(){
	const that = this;
	return new Promise(function(resolve, reject) {
	connection.getConnection(function(error, connection){
		if (error) {
			throw error;
		}

		let values = [
			[that.name, that.address, that.contact_person, that.tele, that.gstn, that.email, that.isActive, that.createdBy]
		]

		connection.query("INSERT INTO customer(name,address,contactPerson,telephone,gstn,email,isActive,createdBy) VALUES ?", [values], function(error,rows,fields){
				if(!error){ 
					resolve(rows);
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d',connection.threadId);
			});
		});
	});
};

Customer.prototype.all = function(){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select id, name from customer where isActive=?', [isActive], function(error,rows,fields){
			 
					if(!error){ 
						resolve(rows);
					} else {
						console.log("Error...", error);
						reject(error);
					}

					connection.release();
					console.log('Process Complete %d',connection.threadId);
				});
		});
	});
};

module.exports = Customer;