const connection = require("../lib/connection.js");

const Document = function (params) {
  this.name = params.name;
  this.id = params.id;
  this.company_id = params.company_id;
  this.task_id = params.task_id;
  this.name = params.name;
  this.createdBy = params.createdBy;
  this.isActive = params.isActive ? 1 : 0;
};

Document.prototype.add = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        console.log("Erorr......", error);
        throw error;
      }


      let values = [
        [that.company_id, that.task_id, that.name, that.isActive, that.createdBy]
      ]

      connection.query("INSERT INTO document(company_id,task_id, name,isActive,createdBy) VALUES ?", [values], function (error, rows, fields) {
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

Document.prototype.all = function () {
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

module.exports = Document;