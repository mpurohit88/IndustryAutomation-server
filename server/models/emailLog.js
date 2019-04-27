const connection = require("../lib/connection.js");

const EmailLog = function () {
  this.isActive = 1;
}

EmailLog.prototype.AllLogs = function () {
  const self = this;

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      connection.query('select quote_id, schedule_id, error_msg, stack_trace, dateTimeCreated from email_log where isActive=? order by dateTimeCreated desc', [self.isActive], function (error, rows, fields) {

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

module.exports = EmailLog;