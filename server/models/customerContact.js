const connection = require("../lib/connection.js");
const CustomerContact = function () { };

CustomerContact.prototype.add = function (customer, contactList) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			let contactValues = [
			];

			contactList.map((data) => {
				contactValues.push([customer.id, data.name, data.designation, data.department, data.email, data.mobileNo, 1])
			});

			connection.query("INSERT INTO `customer_contact`(`customerId`, `name`, `designation`, `department`, `email`, `mobileNo`, `isActive`) VALUES ?", [contactValues], function (error, rows, fields) {
				if (!error) {
					resolve(rows);
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

CustomerContact.prototype.delete = function (customerId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			connection.query("DELETE FROM `customer_contact` WHERE customerId = ?", [customerId], function (error, rows, fields) {
				if (!error) {
					resolve(rows);
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

CustomerContact.prototype.getByCustomerId = function (customerId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			connection.query("SELECT `id`, `name`, `designation`, `department`, `email`, `mobileNo` FROM `customer_contact` WHERE `customerId` = ?", [customerId], function (error, rows, fields) {
				if (!error) {
					resolve(rows);
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

CustomerContact.prototype.getById = function (customerId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			connection.query("SELECT `id`, `name`, `designation`, `department`, `email`, `mobileNo` FROM `customer_contact` WHERE `id` = ?", [customerId], function (error, rows, fields) {
				if (!error) {
					resolve(rows);
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

module.exports = CustomerContact;