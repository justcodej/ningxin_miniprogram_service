const mysql = require('mysql');

module.exports = function (code, value, callback) {
  let config = mysql.createConnection({
    host: "118.190.151.62",
    user: "ningxinziguan_co",
    password: "TfKxKfCEdbcjc7RH",
    port: "3306",
    database: "ningxinziguan_co"
  });
  config.connect();
  config.query(code,value,(err,data)=> {
    callback && callback(err,data);
  });
  config.end();
};
