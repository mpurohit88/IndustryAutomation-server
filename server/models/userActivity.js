const connection = require("../lib/connection.js");

const UserActivity = function () {
	this.isActive = 1;
};

UserActivity.prototype.insert = function (userId, quoteId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			console.log('Process Started %d All', connection.threadId);

			if (error) {
				throw error;
			}

			let values = [
				[userId, quoteId]
			]
			connection.query('INSERT INTO user_activity(userId, quoteId) VALUES ?', [values], function (error, rows, fields) {
				if (!error) {
					resolve(rows.insertId);
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d', connection.threadId);
			});
		});
	});
}

UserActivity.prototype.getUserActivityId = function (userId, quoteId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			console.log('Process Started %d All', connection.threadId);

			if (error) {
				throw error;
			}

			let query = '';
			let arg;

			if (userId) {
				query = 'select id from user_activity where userId=? and quoteId=? order by assignedDate desc';
				arg = [userId, quoteId]
			} else {
				query = 'select id from user_activity where quoteId=? order by assignedDate desc';
				arg = [quoteId]
			}

			connection.query(query, arg, function (error, rows, fields) {

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
}

module.exports = UserActivity;