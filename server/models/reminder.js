const connection = require("../lib/connection.js");

const Reminder = function () {
  this.isActive = 1;
}

Reminder.prototype.AllReminders = function (from_date, to_date, userId, idAdmin) {
  const self = this;

  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let sql = 'select r.id, r.quote_id, s.from_address, s.to_address, s.subject, r.is_new, r.dateTimeCreated from reminder r inner join quote q on q.id = r.quote_id inner join schedule s on s.id = r.schedule_id where r.isActive=?';
      let params = [self.isActive];

      if (!idAdmin) {
        sql += ' and q.createdBy = ?';
        params.push(userId);
      }

      if (from_date) {
        sql += ' and r.dateTimeCreated >= ?';
        params.push(from_date);
      }

      if (to_date) {
        sql += ' and r.dateTimeCreated <= ?';
        params.push(to_date);
      }

      sql += ' order by dateTimeCreated desc LIMIT 400';

      connection.query(sql, params, function (error, reminders, fields) {

        if (error) {
          reject(error);
        }

        let updateParams = [];

        reminders.map(row => {
          row.is_new === 1 && updateParams.push(row.id);
        });

        if (updateParams.length > 0) {
          let updateSql = 'update reminder set is_new = 0 where id in (?)'

          connection.query(updateSql, [updateParams], function (error, rows, fields) {
            if (!error) {
              resolve(reminders);
            } else {
              console.log("Error...", error);
              reject(error);
            }

            connection.release();
            console.log('Process Complete %d', connection.threadId);
          });
        } else {
          if (!error) {
            resolve(reminders);
          } else {
            console.log("Error...", error);
            reject(error);
          }

          connection.release();
          console.log('Process Complete %d', connection.threadId);
        }

      });
    });
  });
}

module.exports = Reminder;