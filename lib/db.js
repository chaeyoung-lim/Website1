var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password:'sakuya66',
    database:'myweb'
  });
  db.connect();
module.exports = db;