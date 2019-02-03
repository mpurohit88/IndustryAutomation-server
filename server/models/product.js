const connection = require("../lib/connection.js");

let Product = function(params){
	this.name = params.name,
	this.companyId = params.companyId,
    this.description =params.description,
    this.unit = params.unit,
	this.hsnCode = params.hsnCode,
	this.createdBy = params.createdBy,
	this.isActive = 1
};

Product.prototype.add = function(){
	const that = this;
	return new Promise(function(resolve, reject) {
	connection.getConnection(function(error, connection){
		if (error) {
			throw error;
		}

		let values = [
			[that.name, that.companyId, that.description, that.unit, that.hsnCode, that.isActive, that.createdBy]
		]

		connection.query("INSERT INTO product(name,companyId,description,unit,hsnCode,isActive,createdBy) VALUES ?", [values], function(error,rows,fields){
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

Product.prototype.all = function(){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select p.id, p.name, p.unit, p.hsnCode, p.dateTimeCreated, u.name as createdBy from product p inner join user u on p.createdBy = u.id where u.isActive=?', [isActive], function(error,rows,fields){
			 
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

Product.prototype.allByCompanyId = function(companyId){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select p.id, p.name, p.unit, p.hsnCode, p.dateTimeCreated, u.name as createdBy from product p inner join user u on p.createdBy = u.id where u.isActive=? and p.companyId=?', [isActive, companyId], function(error,rows,fields){
			 
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

module.exports = Product;