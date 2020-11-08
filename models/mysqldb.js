/*
 * Script for making a connection to the MySQL database 
 * Although this is not a NoSQL db this script is
 * nested under models folder to maintain models philosophy.
 * *
 */
const mysql = require("mysql");

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


// MySQL access parameters object
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME
});

/**
 * Making a connection object with db.
 */

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to MySQL db!');
});

module.exports = connection;