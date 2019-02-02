const QuoteProduct = require("../models/quoteProduct.js")

const getByQuoteId = function(req, res, next){
	try {
        new QuoteProduct({}).getByQuoteId(req.query.quoteId).then(function(quoteProductList) {
            res.send(quoteProductList);
        });
      
 	} catch (err) {
	 	console.log("Error: ", err);
 	}
}

module.exports = {getByQuoteId: getByQuoteId};