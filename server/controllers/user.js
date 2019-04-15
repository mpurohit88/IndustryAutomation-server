const User = require("../models/user.js")

const register = function (req, res, next) {
	let params = {
		createdBy: req.decoded.id,
		organizationId: req.decoded.organizationId,
		id: req.body.id,
		companyId: req.body.companyId,
		name: req.body.name,
		userId: req.body.userId,
		password: req.body.password,
		designation: req.body.designation,
		area: req.body.area,
		address: req.body.address,
		mobileNo: req.body.mobileNo,
		role: 'user',
		isActive: 1,
		email: req.body.email
	};
	const newUser = new User(params);

	try {
		if (params.id) {
			newUser.update().then(function (result) {
				if (req.decoded.role === 'admin') {
					new User({}).all().then(function (userList) {
						res.send({ credentials: result, userList: userList });
					});
				} else {
					res.send([]);
				}
			});
		} else {
			newUser.register().then(function (result) {
				if (req.decoded.role === 'admin') {
					new User({}).all().then(function (userList) {
						res.send({ credentials: result, userList: userList });
					});
				} else {
					res.send([]);
				}
			});
		}

	} catch (err) {
		console.log("Error: ", err);
	}
};


const all = function (req, res, next) {
	try {
		if (req.decoded.role === 'admin') {
			new User({}).all().then(function (userList) {
				res.send({ userList: userList });
			});
		} else {
			res.send([]);
		}
	} catch (err) {
		console.log("Error: ", err);
	}
}

module.exports = { register: register, all: all };