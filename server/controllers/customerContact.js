const CustomerContact = require("../models/customerContact")

const quoteContactDetail = function (req, res, next) {
    try {
        new CustomerContact({}).getById(req.query.id).then(function (customerList) {
            res.send(customerList);
        });

    } catch (err) {
        console.log("Error: ", err);
    }
}

module.exports = { quoteContactDetail: quoteContactDetail };