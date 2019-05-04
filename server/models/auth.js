var connection = require("../lib/connection.js");
var Auth = function (params) {
  this.name = params.name;
  this.password = params.password;
};

Auth.prototype.login = function (newUser) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let values = [that.name, 1];

      connection.query('Select AES_DECRYPT(`password`, \'secret\') AS password, u.id, u.companyId, u.name as userName, c.name, u.organizationId, u.role, c.logo from user u left join company c on u.companyId = c.id where u.userId=? and u.isActive = ?', values, function (error, rows, fields) {

        if (!error) {
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error)
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};

module.exports = Auth;