const connection = require("../lib/connection.js");

const CurrencyType = function (params) {
  this.isActive = 1
};

CurrencyType.prototype.all = function () {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      const isActive = 1;

      connection.query('select id, name, html_code from currency_type where isActive=?', [isActive], function (error, rows, fields) {

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

module.exports = CurrencyType;