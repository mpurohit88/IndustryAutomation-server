var connection = require("../lib/connection.js");
var Auth = function(params){
   this.name = params.name;
   this.password = params.password;
};

Auth.prototype.login = function(newUser){
  const that = this;
  return new Promise(function(resolve, reject) {
  connection.getConnection(function(error, connection){
    if (error) {
			throw error;
    }
    
    let values = [
      [that.name]
    ]

    connection.query('Select AES_DECRYPT(`password`, \'secret\') AS password, id, companyId, organizationId, role from user where name=?', [values], function(error,rows,fields){
      
        if(!error){ 
          resolve(rows);
        } else {
          console.log("Error...", error);
          reject(error)
        }

        connection.release();
        console.log('Process Complete %d',connection.threadId);
      });
    });
  });
};

module.exports = Auth;