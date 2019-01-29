const Quote = require("../models/quote.js")

const create = function(req, res, next){

    let params = {
        createdBy: req.decoded.id,
        party_name: req.body.quote.party_name, 
        address: req.body.quote.address,
        phoneNo: req.body.quote.phoneNo,
        mobileNo: req.body.quote.mobileNo,
        products: req.body.productList
    };
            
    const newQuote = new Quote(params);

    try {
        if(req.body.productList.length <= 0) throw new Error('Product list can not be empty');

       newQuote.create().then(function(result) {
		   res.status(200).send(result);
	   });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err);
    }
};

const all = function(req, res, next){
	try {
        if(req.decoded.role === 'admin') {
					new Quote({}).all().then(function(quoteList) {
						res.send(quoteList);
					});
        } else {
					new Quote({}).allByUserId(req.decoded.id).then(function(quoteList) {
						res.send(quoteList);
					});
        }
 	} catch (err) {
	 	console.log("Error: ", err);
 	}
}

module.exports = {create: create, all: all};