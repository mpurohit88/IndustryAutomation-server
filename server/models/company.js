var connection = require("../lib/connection.js");
var Company = function(params){
	this.organizationId = params.organizationId,
	this.createdBy = params.createdBy,
    this.name = params.name,
    this.address =params.address,
    this.city = params.city,
    this.state = params.state,
    this.country = params.country,
    this.tele = params.tele,
    this.fax = params.fax,
    this.mobileNo =params.mobileNo,
    this.email = params.email,
    this.website = params.website,
    this.gstn = params.gstn,
    this.logo = params.logo,
    this.manufacturerOf = params.manufacturerOf,
    this.isActive = 1
};

Company.prototype.register = function(){
	const that = this;
	return new Promise(function(resolve, reject) {
	connection.getConnection(function(error, connection){
		if (error) {
		  throw error;
		}

		let values = [
			[that.organizationId, that.name, that.address, that.city, that.state, that.country, that.tele, that.fax, that.mobileNo, that.email, that.website, that.gstn, that.logo, that.manufacturerOf, that.isActive, that.createdBy]
		]

		connection.query('INSERT INTO company(organizationId,name,address,city,state,country,tele,fax,mobileNo,email,website,gstn,logo,manufacturerOf,isActive,createdBy) VALUES ?', [values], function(error,rows,fields){
			
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

Company.prototype.all = function(){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select id, name from company where isActive=?', [isActive], function(error,rows,fields){
			 
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

module.exports = Company;