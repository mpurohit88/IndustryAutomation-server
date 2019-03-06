const connection = require("../lib/connection.js");

const TaskEmail = function (params) {
    this.name = params.name,
        this.task_id = params.task_id,
        this.subject = params.subject,
        this.body = params.body,
        this.createdBy = params.createdBy,
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
                [that.task_id, that.subject, that.body, that.isActive, that.createdBy]
            ]

            connection.query("INSERT INTO task_email(task_id,subject,body,isActive,createdBy) VALUES ?", [values], function (error, rows, fields) {
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

module.exports = TaskEmail;