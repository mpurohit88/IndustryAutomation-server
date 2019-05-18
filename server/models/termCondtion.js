const connection = require("../lib/connection.js");

const TermCondition = function () {
  this.isActive = 1;
}

TermCondition.prototype.getByCompanyId = function (companyId) {
  const self = this;

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.query('select text from email_log where isActive=? order by dateTimeCreated desc', [self.isActive], function (error, rows, fields) {

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

module.exports = TermCondition;