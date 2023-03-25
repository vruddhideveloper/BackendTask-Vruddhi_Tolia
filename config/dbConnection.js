const mysql = require("mysql");
// const promise = require("mysql2/promise");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vruddhi@9",
  database: "contact_information",
  port: 3306,
});

connection.connect();

module.exports = connection;
