
// This will be in some JSON config we'll say
var dbOptions = {
    host:'remotemysql.com',
    user     : 'uqPOgm6gSd',
    password : '6AKRzqrPSs',
    database : 'uqPOgm6gSd',
    port: 3306
};


//This will depend on which version/module/db you're using, but here's what mine looks like
const MySQL = require("mysql");
// const config = require("../config/db.json");
let connectionPool = MySQL.createPool({host: dbOptions.host, user: dbOptions.user, password: dbOptions.password, port: dbOptions.port, database: dbOptions.database});

const getConnection = function(done){
   connectionPool.getConnection(done);
};

module.exports = {getConnection: getConnection};