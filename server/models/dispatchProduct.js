const connection = require("../lib/connection.js");
let DispatchProduct = function (params) {
  this.dispatch_summary_id = params.dispatch_summary_id,
    this.product_id = params.product_id,
    this.description = params.description,
    this.unit = params.unit,
    this.qty = params.qty,
    this.isActive = 1
};

DispatchProduct.prototype.add = function (dispatch_summary, products) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let productList = [
      ];

      products.map((data) => {
        productList.push([dispatch_summary.id, data.product_id, data.description, data.unit, data.qty, 1])
      });

      connection.query("INSERT INTO `dispatch_product`(`dispatch_summary_id`, `product_id`, `description`, `unit`, `qty`, `isActive`) VALUES ?", [productList], function (error, rows, fields) {
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

module.exports = DispatchProduct;