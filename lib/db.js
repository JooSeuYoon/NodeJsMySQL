var mysql = require('mysql');
const pwd = require('../security/password');

var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password: pwd,
  database : 'opentutorials',
});

db.connect();

module.exports = db;