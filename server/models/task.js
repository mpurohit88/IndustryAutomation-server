const connection = require("../lib/connection.js");

const Task = function(){
   this.isActive = 1;
};

Task.prototype.all = function() {
    return new Promise(function(resolve, reject) {
      connection.getConnection(function(error, connection){
        console.log('Process Started %d All',connection.threadId);
  
        if (error) {
          throw error;
        }
  
        const isActive = 1;
  
				connection.query('select id, text, sortOrder from task where isActive=? order by sortOrder asc', [isActive], function(error,rows,fields){
					
					if(!error){ 
							resolve(rows);
					} else {
							console.log("Error...", error);
							reject(error);
					}

					connection.release();
					console.log('Process Complete %d',connection.threadId);
				});
      });
    });
  }

  module.exports = Task;