/*
 * License: The MIT License (MIT)
 * Author:E-bank IT team
 * Author email: @ebanka-it.com
 * Date: Fri Aug 23 2019
 * Description:
 * Although this is not model of account table
 * (because it is not a NoSQL db) this module is
 * nested under models folder to maintain models philosophy.
 * *
 */
const mysql = require("mysql");

// MySQL access parameters object
const connection = mysql.createConnection({
    host: 'db4free.net',
    port: 3306,
    user: 'aff_test',
    password: 'afftestafftest',
    database: 'aff_task'
});

/*
Making a connection object with db.
 */
connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to MySQL db!');
});

module.exports = connection;