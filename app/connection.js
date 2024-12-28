const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "root",
    database: 'todo_app'
});

module.exports = connection;