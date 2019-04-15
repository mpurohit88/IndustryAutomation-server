const connection = require("../lib/connection.js");
const utils = require("../utils");

var User = function (params) {
  this.id = params.id;
  this.email = params.email;
  this.password = params.password; //utils.randomString(11);
  this.companyId = params.companyId;
  this.organizationId = params.organizationId;
  this.name = params.name;
  this.userId = params.userId;
  this.designation = params.designation;
  this.area = params.area;
  this.address = params.address;
  this.mobileNo = params.mobileNo;
  this.role = params.role;
  this.isActive = params.isActive;
  this.createdBy = params.createdBy;
};

User.prototype.register = function (newUser) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      // let values = [
      //   [that.company_id, that.name, AES_ENCRYPT(that.password, 'secret'), that.designation, that.address, that.area, that.mobileNo, that.email, that.isActive, that.createdBy]
      // ]


      // connection.query('SELECT MAX(id) as id FROM user', function (error, rows, fields) {
      // const userId = that.name.slice(0, 4).toLowerCase() + (rows[0].id + 1);

      if (!error) {
        connection.query('INSERT INTO user(companyId,organizationId,name,userId,password,designation,address,area,mobileNo,email,role,isActive,createdBy) VALUES ("' + that.companyId + '", "' + that.organizationId + '", "' + that.name + '", "' + that.userId + '", AES_ENCRYPT("' + that.password + '", "secret"), "' + that.designation + '", "' + that.area + '", "' + that.address + '", "' + that.mobileNo + '", "' + that.email + '", "' + that.role + '", "' + that.isActive + '", "' + that.createdBy + '")', function (error, rows, fields) {

          if (!error) {
            resolve({ userName: that.name, userId: that.userId, password: that.password });
          } else {
            console.log("Error...", error);
            reject(error)
          }
        });
      } else {
        console.log("Error...", error);
        reject(error)
      }

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
  // });
};

User.prototype.update = function (newUser) {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      const values = [that.companyId, that.organizationId, that.name, that.userId, that.password, that.designation, that.address, that.area, that.mobileNo, that.email, that.role, that.id];

      if (!error) {
        connection.query('Update user set companyId = "' + that.companyId + '", organizationId = "' + that.organizationId + '", name = "' + that.name + '", userId = "' + that.userId + '", password = AES_ENCRYPT("' + that.password + '", "secret"), designation = "' + that.designation + '", address = "' + that.address + '", area = "' + that.area + '", mobileNo = "' + that.mobileNo + '", email = "' + that.email + '", role = "' + that.role + '" Where Id = "' + that.id + '"', values, function (error, rows, fields) {

          if (!error) {
            resolve({ userName: that.name, userId: that.userId, password: that.password });
          } else {
            console.log("Error...", error);
            reject(error)
          }
        });
      } else {
        console.log("Error...", error);
        reject(error)
      }

      connection.release();
      console.log('Process Complete %d', connection.threadId);
    });
  });
};

User.prototype.all = function () {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      const isActive = 1;

      connection.query('select u.id, c.name as companyName, u.companyId, u.name, u.userId, u.designation, u.area, u.address, u.mobileNo, u.email, u.dateTimeCreated from user u inner join company c on u.companyId = c.id where u.isActive=?', [isActive], function (error, rows, fields) {

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

module.exports = User;