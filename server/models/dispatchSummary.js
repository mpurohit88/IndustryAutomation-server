const connection = require("../lib/connection.js");
let DispatchSummary = function (params) {
  this.task_id = params.task_id,
    this.quote_id = params.quote_id,
    this.company_id = params.company_id,
    this.customer_id = params.customer_id,
    this.order_no = params.order_no,
    this.order_date = params.order_date,
    this.invoice_no = params.invoice_no,
    this.invoice_date = params.invoice_date,
    this.bilty_no = params.bilty_no,
    this.transporter_name = params.transporter_name,
    this.up_to = params.up_to,
    this.amount = params.amount,
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
        [that.task_id, that.company_id, that.customer_id, that.quote_id, that.order_no, that.invoice_no, that.invoice_date, that.transporter_name, that.bilty_no, that.up_to, that.amount, that.isActive, that.createdBy]
      ]

      connection.query("INSERT INTO `dispatch_summary`(`task_id`, `company_id`, `customer_id`, `quote_id`, `order_no`, `invoice_no`, `invoice_date`, `transporter_name`, `bilty_no`, `up_to`, `amount`, `isActive`, `createdBy`) VALUES ?", [values], function (error, rows, fields) {
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

DispatchSummary.prototype.getByQuoteId = function (quote_id) {
  const self = this;

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.query('select `task_id`, `company_id`, `customer_id`, `quote_id`, `order_no`, `invoice_no`, `invoice_date`, `transporter_name`, `bilty_no`, `up_to`, `amount`, ds.`isActive`, `createdBy` from dispatch_summary as ds where ds.isActive=? and quote_id=?', [self.isActive, quote_id], function (error, rows, fields) {

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

module.exports = DispatchSummary;