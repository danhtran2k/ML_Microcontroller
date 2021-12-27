var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micro_smart"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("MYSQL Connected!!!")
  });
  module.exports = con
