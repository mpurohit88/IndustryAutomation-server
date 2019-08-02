const connection = require("../lib/connection.js");

const Marketing = function () {
  this.isActive = 1;
}

Marketing.prototype.GetTemplate = function (company_id) {
  const self = this;

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.query('select template_path from marketing where isActive=? and company_id = ?', [self.isActive, company_id], function (error, rows, fields) {

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

Marketing.prototype.SendEmail = function (data, company_id, createdBy) {
  const self = this;

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let values = [
        [company_id, data.from, data.to, data.cc, data.bcc, data.subject, self.isActive, createdBy]
      ]

      connection.query('INSERT INTO marketing_email(`company_id`, `from`, `to`, `cc`, `bcc`, `subject`, `is_active`, `createdBy`) Values ?', [values], function (error, rows, fields) {

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

module.exports = Marketing;