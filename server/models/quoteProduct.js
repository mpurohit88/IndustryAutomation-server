const connection = require("../lib/connection.js");
const QuoteProduct = function () {

};

QuoteProduct.prototype.getByQuoteId = function (quoteId) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			console.log('Process Started %d All', connection.threadId);

			if (error) {
				throw error;
			}

			connection.query('select qp.product_id, p.name, q.currency_type, qp.description, qp.unit, qp.quantity, qp.gstn, qp.rate, p.hsnCode, p.imgName from quote_product qp inner join product p on qp.product_id = p.id inner join quote q on qp.quote_id = q.id where qp.quote_id = ? order by qp.id asc', [quoteId], function (error, rows, fields) {
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


QuoteProduct.prototype.delete = function (quote_id) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			connection.query("DELETE FROM `quote_product` WHERE quote_id = ?", [quote_id], function (error, rows, fields) {
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

QuoteProduct.prototype.add = function (id, products, createdBy) {
	return new Promise(function (resolve, reject) {
		connection.getConnection(function (error, connection) {
			if (error) {
				throw error;
			}

			let productValues = [
			];

			products.map((data) => {
				productValues.push([id, data.product_id, data.quantity, data.description, data.gstn, data.rate, data.unit, 1, createdBy])
			});

			connection.query('INSERT INTO quote_product(quote_id,product_id,quantity,description,gstn,rate,unit,isActive,createdBy) VALUES ?', [productValues], function (error, rows, fields) {
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

module.exports = QuoteProduct;