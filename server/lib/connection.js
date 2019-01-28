
// This will be in some JSON config we'll say
var dbOptions = {
    host:'localhost',
    user     : 'root',
    password : '',
    database : 'work_manamgement'
};


//This will depend on which version/module/db you're using, but here's what mine looks like
const MySQL = require("mysql");
// const config = require("../config/db.json");
let connectionPool = MySQL.createPool({host: dbOptions.host, user: dbOptions.user, password: dbOptions.password, port: dbOptions.port, database: dbOptions.database});

const getConnection = function(done){
   connectionPool.getConnection(done);
};

module.exports = {getConnection: getConnection};