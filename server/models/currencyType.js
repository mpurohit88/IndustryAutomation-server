const connection = require("../lib/connection.js");

const CurrencyType = function (params) {
  this.name = params.name;
  this.id = params.id;
  this.html_code = params.html_code;
  this.createdBy = params.createdBy;
  this.isActive = params.isActive ? 1 : 0;
};

CurrencyType.prototype.add = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let values = [
        [that.name, that.html_code, that.isActive, that.createdBy]
      ]

      connection.query("INSERT INTO currency_type(name,html_code,isActive,createdBy) VALUES ?", [values], function (error, rows, fields) {
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