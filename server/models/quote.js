const connection = require("../lib/connection.js");
const Quote = function (params) {
  this.id = params.id;
  this.companyId = params.companyId;
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

  try {
    return new Promise(function (resolve, reject) {
      connection.getConnection(function (error, connection) {
        if (error) {
          throw error;
        }

        let values = [
          [that.party_name, that.companyId, that.address, that.currency_type, that.phoneNo, that.mobileNo, that.contact_person_id, that.status, that.isActive, that.createdBy]
        ]

        connection.query('INSERT INTO quote(party_id,companyId,address,currency_type,phoneNo,mobileNo,contact_person_id,status,isActive,createdBy) VALUES ?', [values], function (error, rows, fields) {

          if (error) reject(error);

          if (rows) {
            let quoteId = rows.insertId;

            let productValues = [
            ];

            that.products.map((product) => {
              productValues.push([quoteId, product.product_id, product.quantity, product.description, product.gstn, product.rate, product.unit, that.isActive, that.createdBy])
            });

            connection.query('INSERT INTO quote_product(quote_id,product_id,quantity,description,gstn,rate,unit,isActive,createdBy) VALUES ?', [productValues], function (error, productRows, fields) {

              if (!error) {
                resolve({ 'quote_id': quoteId });
              } else {
                console.log("Error...", error);
                reject(error)
              }

              connection.release();
              console.log('Process Complete %d', connection.threadId);
            });
          } else {
            console.log("Quote Id did not got generated....", rows)
            reject({ 'Error': 'Quote Id did not generated' })
          }
        });
      });
    });
  }
  catch (error) {
    console.error(error);
    throw error;
  }
};

Quote.prototype.updateQuote = function () {
  const that = this;
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let values = [that.party_name, that.address, that.currency_type, that.phoneNo, that.mobileNo, that.contact_person_id, that.isActive, that.id];

      connection.query('UPDATE quote SET party_id=?, address=?, currency_type=?, phoneNo=?, mobileNo=?, contact_person_id=?, isActive=? WHERE id = ?', values, function (error, rows, fields) {

        if (error) reject(error);

        if (!error) {
          resolve({ 'quote_id': that.id });
        } else {
          console.log("Error...", error);
          reject(error)
        }

        connection.release();
        console.log('Process Complete %d', connection.threadId);
      });
    });
  });
};

Quote.prototype.all = function (customerId, userId, statusId, from_date, to_date) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {
      console.log('Process Started %d All', connection.threadId);

      if (error) {
        throw error;
      }

      const isActive = 1;
      let sql = 'select q.id, c.name as companyName, q.contact_person_id, q.address, q.currency_type, q.phoneNo, q.mobileNo, q.status, q.dateTimeCreated, u.name from quote q inner join user u on u.id = q.createdBy inner join customer c on q.party_id = c.id where q.isActive=? '
      let params = [isActive];

      if (customerId) {
        sql += ' and c.id = ?';
        params.push(customerId);
      }

      if (userId) {
        sql += ' and u.id = ?';
        params.push(userId);
      }

      if (statusId) {
        sql += ' and q.status = ?';
        params.push(statusId);
      }

      if (from_date) {
        sql += ' and q.dateTimeCreated >= ?';
        params.push(from_date);
      }

      if (to_date) {
        sql += ' and q.dateTimeCreated <= ?';
        params.push(to_date);
      }

      sql += ' order by q.id desc LIMIT 400';

      connection.query(sql, params, function (error, rows, fields) {

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

Quote.prototype.allByUserId = function (userId, customerId, statusId, from_date, to_date) {
  return new Promise(function (resolve, reject) {
    connection.getConnection(function (error, connection) {

      if (error) {
        throw error;
      }

      console.log('Process Started %d All', connection.threadId);

      const isActive = 1;
      let sql = 'select q.id, c.name as companyName, q.contact_person_id, q.address, q.currency_type, q.phoneNo, q.mobileNo, q.status, q.dateTimeCreated, \'Self\' as name from quote q inner join customer c on q.party_id = c.id where q.isActive=? and q.createdBy=? ';
      let params = [isActive, userId];

      if (customerId) {
        sql += ' and c.id = ?';
        params.push(customerId);
      }

      if (statusId) {
        sql += ' and q.status = ?';
        params.push(statusId);
      }

      if (from_date) {
        sql += ' and q.dateTimeCreated >= ?';
        params.push(from_date);
      }

      if (to_date) {
        sql += ' and q.dateTimeCreated <= ?';
        params.push(to_date);
      }

      sql += ' order by q.id desc LIMIT 400';

      connection.query(sql, params, function (error, rows, fields) {

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

      connection.query('select q.id, q.companyId, c.name as companyName, c.id as customer_id, q.contact_person_id, c.email, q.address, q.currency_type, q.phoneNo, q.mobileNo, q.status, q.dateTimeCreated, u.name as userName, u.email as userEmail from quote q inner join customer c on q.party_id = c.id inner join user as u on q.createdBy = u.id where q.isActive=? and q.id = ? order by q.id desc', [isActive, quoteId], function (error, rows, fields) {

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