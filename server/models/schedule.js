const connection = require("../lib/connection.js");

const Schedule = function (params) {
    this.name = params.name,
        this.task_id = params.task_id,
        this.scheduleId = params.scheduleId,
        this.company_id = params.company_id,
        this.subject = params.subject,
        this.message_body = '',
        this.next_reminder_date = new Date(),
        this.from_address = params.from_address,
        this.to_address = params.to_address,
        this.frequency = params.frequency,
        this.time = params.time,
        this.createdBy = params.createdBy,
        this.isActive = 1
};

Schedule.prototype.add = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
        connection.getConnection(function (error, connection) {
            if (error) {
                throw error;
            }

            let values = [
                [that.task_id, that.company_id, that.subject, that.next_reminder_date, that.message_body, that.from_address, that.to_address, that.frequency, that.time, that.isActive, that.createdBy]
            ]

            connection.query("INSERT INTO schedule(task_id,company_id,subject,next_reminder_date,message_body,from_address,to_address,frequency,time,isActive,createdBy) VALUES ?", [values], function (error, rows, fields) {
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

Schedule.prototype.update = function () {
    const that = this;
    return new Promise(function (resolve, reject) {
        connection.getConnection(function (error, connection) {
            if (error) {
                throw error;
            }

            let values = [that.from_address, that.to_address, that.frequency, that.time, that.scheduleId];

            connection.query("Update schedule set from_address = ?,to_address = ?,frequency = ?,time = ? Where Id = ?", values, function (error, rows, fields) {
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

Schedule.prototype.getScheduleDetails = function (scheduleId) {
    const that = this;
    return new Promise(function (resolve, reject) {
        connection.getConnection(function (error, connection) {
            if (error) {
                throw error;
            }

            connection.query("SELECT Frequency, Time From Schedule WHERE id = ?", [scheduleId], function (error, rows, fields) {
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

module.exports = Schedule;