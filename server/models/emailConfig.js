const connection = require("../lib/connection.js");

const EmailConfig = function () {
    this.isActive = 1;
}

EmailConfig.prototype.readByCompanyId = function (companyId) {
    const self = this;

    return new Promise(function (resolve, reject) {
        connection.getConnection(function (error, connection) {
            if (error) {
                throw error;
            }

            connection.query('select email_id, password, port, host from email_config where isActive=? and company_id=?', [self.isActive, companyId], function (error, rows, fields) {

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

module.exports = EmailConfig;