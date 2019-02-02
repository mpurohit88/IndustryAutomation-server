const connection = require("../lib/connection.js");
const QuoteProduct = function(){
  
};


QuoteProduct.prototype.getByQuoteId = function(quoteId) {
  return new Promise(function(resolve, reject) {
    connection.getConnection(function(error, connection){
      console.log('Process Started %d All',connection.threadId);

      if (error) {
        throw error;
			}
			
			connection.query('select qp.product_id, p.name, qp.quantity, qp.gstn from quote_product qp inner join product p on qp.product_id = p.id where qp.quote_id = ?', [quoteId], function(error,rows,fields){
					
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
}

module.exports = QuoteProduct;