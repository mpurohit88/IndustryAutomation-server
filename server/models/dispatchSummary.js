const connection = require("../lib/connection.js");
let DispatchSummary = function (params) {
  this.task_id = params.task_id,
    this.quote_id = params.quote_id,
    this.company_id = params.customer_id,
    this.order_no = params.order_no,
    this.order_date = params.order_date,
    this.invoice_no = params.invoice_no,
    this.invoice_date = params.invoice_date,
    this.builty_no = params.builty_no,
    this.up_to = params.up_to,
    this.createdBy = params.createdBy,
    this.isActive = 1
};

DispatchSummary.prototype.add = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let values = [
        [that.task_id, that.company_id, that.quote_id, that.order_no, that.order_date, that.invoice_no, that.invoice_date, that.builty_no, that.up_to, that.isActive, that.createdBy]
      ]

      connection.query("INSERT INTO `dispatch_summary`(`task_id`, `customer_id`, `quote_id`, `order_no`, `order_date`, `invoice_no`, `invoice_date`, `builty_no`, `up_to`, `isActive`, `createdBy`) VALUES ?", [values], function (error, rows, fields) {
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

module.exports = DispatchSummary;