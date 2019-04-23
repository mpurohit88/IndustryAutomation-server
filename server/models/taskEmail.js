const connection = require("../lib/connection.js");

const TaskEmail = function (params) {
    this.name = params.name,
        this.task_id = params.task_id,
        this.subject = params.subject,
        this.body = params.body,
        this.createdBy = params.createdBy,
        this.quoteId = params.quoteId,
        this.isActive = 1
};

TaskEmail.prototype.add = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
        connection.getConnection(function (error, connection) {
            if (error) {
                throw error;
            }

            let values = [
                [that.task_id, that.subject, that.body, that.quoteId, that.isActive, that.createdBy]
            ]

            connection.query("INSERT INTO task_email(task_id,subject,body,quote_id,isActive,createdBy) VALUES ?", [values], function (error, rows, fields) {
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

TaskEmail.prototype.getEmailBody = function (task_id) {
    const self = this;

    return new Promise(function (resolve, reject) {
        connection.getConnection(function (error, connection) {
            if (error) {
                throw error;
            }

            connection.query('select body from task_email where isActive=1 and task_id=? order by dateTimeCreated desc LIMIT 1;', [task_id], function (error, rows, fields) {

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

module.exports = TaskEmail;