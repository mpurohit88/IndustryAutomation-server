const connection = require("../lib/connection.js");

const ActivityTaskHist = function () {
  this.isActive = 1;
};

ActivityTaskHist.prototype.insert = function (userActivityId, tasks) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }


      let values = [
      ];

      tasks.map((task) => {
        values.push([userActivityId, task.id, null, null, task.sortOrder, 1])
      });

      connection.query('INSERT INTO `activity_task_hist`(`userActivityId`, `taskId`, `startDate`, `endDate`, `sortOrder`, `isActive`) VALUES ?', [values], function (error, rows, fields) {

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

ActivityTaskHist.prototype.getByActivityId = function (userActivityIds) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      let ids = []

      userActivityIds.map((row) => {
        ids.push(row.id);
      })

      connection.query('select at.id, at.userActivityId, at.taskId, t.text, at.startDate, at.endDate, at.sortOrder, s.id as scheduleId from activity_task_hist as at inner join task t on at.taskId = t.id left join schedule as s on at.id = s.task_id where userActivityId in (?) order by at.sortOrder asc', [ids], function (error, rows, fields) {

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

ActivityTaskHist.prototype.update = function (userActivityId) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      connection.query('UPDATE activity_task_hist SET startDate=? WHERE id = ?', [new Date(), userActivityId], function (error, rows, fields) {

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

ActivityTaskHist.prototype.complete = function (userActivityId) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      connection.query('UPDATE activity_task_hist SET endDate=? WHERE id = ?', [new Date(), userActivityId], function (error, rows, fields) {

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

module.exports = ActivityTaskHist;