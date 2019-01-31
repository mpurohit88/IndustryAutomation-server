const User = require("../models/user.js")

const register = function(req, res, next){
    let params = {
					createdBy: req.decoded.id,
					organizationId: req.decoded.organizationId,
					companyId: req.body.company_name,
					name:req.body.name,
					password:req.body.password,
					designation: req.body.designation,
					area: req.body.area,
					address: req.body.address,
					mobNo: req.body.mobNo,
					role: 'user',
					isActive: 1,
					email: req.body.email
			};
    const newUser = new User(params);

    try {
       newUser.register().then(function(result) {
		   res.send(result);
	   });
    } catch (err) {
			console.log("Error: ", err);
    }
};


const all = function(req, res, next){
	try {
        if(req.decoded.role === 'admin') {
			new User({}).all().then(function(userList) {
				res.send(userList);
			});
		} else {
			res.send([]);
		}
 	} catch (err) {
	 	console.log("Error: ", err);
 	}
}

module.exports = {register: register, all: all};