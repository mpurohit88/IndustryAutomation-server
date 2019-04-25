const connection = require("../lib/connection.js");
const Customer = function (params) {
	this.id = params.id;
	this.name = params.name;
	this.address = params.address;
	this.contact_person = params.contact_person;
	this.tele = params.tele;
	this.gstn = params.gstn;
	this.email = params.email
	this.createdBy = params.createdBy;
	this.isActive = params.isActive ? 1 : 0;
};

Customer.prototype.add = function () {
	const that = this;
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			let values = [
				[that.name, that.address, that.tele, that.gstn, that.email, that.isActive, that.createdBy]
			]

			connection.query("INSERT INTO customer(name,address,telephone,gstn,email,isActive,createdBy) VALUES ?", [values], function (error, rows, fields) {
				if (!error) {
					resolve({ 'id': rows.insertId });
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d', connection.threadId);
			});
		});
	});
};


Customer.prototype.update = function () {
	const that = this;
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			let values = [that.name, that.address, that.tele, that.gstn, that.email, that.isActive, that.createdBy, that.id];

			connection.query("UPDATE customer set name = ?,address = ?,telephone = ?,gstn = ?,email = ?,isActive = ?, updatedBy =? WHERE id = ?", values, function (error, rows, fields) {
				if (!error) {
					resolve({ 'id': rows.insertId });
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d', connection.threadId);
			});
		});
	});
};

Customer.prototype.allByUserId = function (userId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			const isActive = 1;
			let result = [];
			connection.query('select id, name, address, telephone, gstn, email, dateTimeCreated, isActive from customer where isActive=? and createdBy=?', [isActive, userId], function (error, rows, fields) {

				if (!error) {

					if (rows.length > 0) {
						rows.map((customer, index) => {
							connection.query('select id, name, designation, department, email, mobileNo, dateTimeCreated from customer_contact where customerId=?', [customer.id], function (error, customerContact, fields) {
								if (!error) {
									let obj = customer;
									obj.customerContact = customerContact;

									result.push(obj);
									if (index === rows.length - 1) {
										resolve(result);
									}
								} else {
									console.log("Error...", error);
									reject(error);
								}
							});
						});
					} else {
						resolve(rows);
					}
					// resolve(rows);
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d', connection.threadId);
			});
		});
	});
};

Customer.prototype.all = function () {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			const isActive = 1;
			let result = [];

			connection.query('select id, name, address, telephone, gstn, email, dateTimeCreated, isActive from customer where isActive=?', [isActive], function (error, rows, fields) {

				if (!error) {

					rows.map((customer, index) => {
						connection.query('select id, name, designation, department, email, mobileNo, dateTimeCreated from customer_contact where customerId=?', [customer.id], function (error, customerContact, fields) {
							if (!error) {
								let obj = customer;
								obj.customerContact = customerContact;

								result.push(obj);
								if (index === rows.length - 1) {
									resolve(result);
								}
							} else {
								console.log("Error...", error);
								reject(error);
							}
						});
					});

					// resolve(rows);
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d', connection.threadId);
			});
		});
	});
};

module.exports = Customer;