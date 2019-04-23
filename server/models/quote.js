const connection = require("../lib/connection.js");
const Quote = function (params) {
  this.party_name = params.party_name;
  this.address = params.address;
  this.currency_type = params.currency_type;
  this.phoneNo = params.phoneNo;
  this.mobileNo = params.mobileNo;
  this.contact_person_id = params.contact_person;
  this.isActive = 1;
  this.status = 1;
  this.createdBy = params.createdBy;
  this.products = params.products;
};

Quote.prototype.create = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let values = [
        [that.party_name, that.address, that.currency_type, that.phoneNo, that.mobileNo, that.contact_person_id, that.status, that.isActive, that.createdBy]
      ]

      connection.query('INSERT INTO quote(party_id,address,currency_type,phoneNo,mobileNo,contact_person_id,status,isActive,createdBy) VALUES ?', [values], function (error, rows, fields) {

        if (error) reject(error);

        let quoteId = rows.insertId;

        let productValues = [
        ];

        that.products.map((product) => {
          productValues.push([quoteId, product.product_id, product.qty, product.description, product.gst, product.rate, that.isActive, that.createdBy])
        });

        connection.query('INSERT INTO quote_product(quote_id,product_id,quantity,description,gstn,rate,isActive,createdBy) VALUES ?', [productValues], function (error, productRows, fields) {

          if (!error) {
            resolve({ 'quote_id': quoteId });
          } else {
            console.log("Error...", error);
            reject(error)
          }

          connection.release();
          console.log('Process Complete %d', connection.threadId);
        });
      });
    });
  });
};

Quote.prototype.all = function () {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      const isActive = 1;

      connection.query('select q.id, c.name as companyName, q.contact_person_id, q.address, q.currency_type, q.phoneNo, q.mobileNo, q.status, q.dateTimeCreated, u.name from quote q inner join user u on u.id = q.createdBy inner join customer c on q.party_id = c.id where q.isActive=? order by q.id desc', [isActive], function (error, rows, fields) {

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

Quote.prototype.allByUserId = function (userId) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      const isActive = 1;

      connection.query('select q.id, c.name as companyName, q.contact_person_id, q.address, q.currency_type, q.phoneNo, q.mobileNo, q.status, q.dateTimeCreated, \'Self\' as name from quote q inner join customer c on q.party_id = c.id where q.isActive=? and q.createdBy=? order by q.id desc', [isActive, userId], function (error, rows, fields) {

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

Quote.prototype.getQuoteDetail = function (userId, quoteId) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      const isActive = 1;

      connection.query('select q.id, c.name as companyName, c.id as companyId, q.contact_person_id, c.email, q.address, q.currency_type, q.phoneNo, q.mobileNo, q.status, q.dateTimeCreated, u.name as userName from quote q inner join customer c on q.party_id = c.id inner join user as u on q.createdBy = u.id where q.isActive=? and q.id = ? order by q.id desc', [isActive, quoteId], function (error, rows, fields) {

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

Quote.prototype.update = function (quoteId, status) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      connection.query('UPDATE quote SET status=? WHERE id = ?', [status, quoteId], function (error, rows, fields) {

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

module.exports = Quote;