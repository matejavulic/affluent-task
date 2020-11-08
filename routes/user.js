/**
 * Node.js script to fetch data from an API (reqres.in).
 */
var express = require('express');
var router = express.Router();
const axios = require('axios');
const Mysqldb = require('../models/mysqldb');

let isFetched = 'false'
let status = 'false'

/**
 * Function to remap [{},{},{}...] to [[],[],[]...],
 * so it can be inserted as multi INSERT
 *  */
var remapToList = function(object) {

    list = []
    atr = []

    for (let key in object) {
        for (let key2 in object[key]) {
            atr.push(object[key][key2])
        }
        list.push(atr)
        atr = []
    }

    return list
}

// function to insert all fetched reqres user data into database using multi INSERT sql query
var saveUsersDb = function(user) {

    return new Promise(function(resolve, reject) {
        userList = remapToList(user)
        let query = `INSERT INTO user (fetched_id, email, name, surname, avatar) VALUES ?`;
        Mysqldb.query(query, [userList], (err, results, fields) => {

            if (err) {
                reject(err);
            }

            resolve(1)
        });
    })
}

// function to build and execute axios fetch call on reqres api
var fetchUsers = function(url, param) {

    return new Promise(function(resolve, reject) {
        axios.get(url + '?' + param + '=1').then(response => {

            let users = response.data.data

            let pages = response.data.total_pages
            if (pages > 1) {

                for (let i = 2; i <= pages; i++) {
                    axios.get(url + '?' + param + '=' + i).then(resp => {

                        for (let k = 0; k <= resp.data.data.length - 1; k++)
                            users.push(resp.data.data[k])

                    }).then(() => {
                        resolve({ 'state': 'success', 'data': users })
                    })
                }

            } else
                resolve({ 'state': 'success', 'data': users })

        }).catch(err => { // api error handler
            reject({ 'state': 'error', 'data': { 'code': err.code, 'url': err.config['url'] } })
        })
    })

}

// function to retreive all user data from database 
var getUserDb = function() {

    return new Promise(function(resolve, reject) {
        let query = `SELECT * FROM user`;
        Mysqldb.query(query, (err, results, fields) => {

            if (err) {
                reject(err);
            }
            resolve(results)
        });
    })
}

/**
 * Function to handle incoming request for fetching reqres user data,
 * returns success or error object to user view (user.pug)
 * */
router.get('/', function(req, res, next) {

    isFetched = false
    isSaved = false
    status = 'success'

    fetchUsers('https://reqres.in/api/users', 'page').then((fetchedUsers, error) => {
        isFetched = true;

        saveUsersDb(fetchedUsers.data).then((success, error) => {
            isSaved = true

            res.render('user', {
                isFetched: isFetched,
                isSaved: isSaved,
                status: status,

            })
        }).catch(err => { //db error handler
            isSaved = false
            status = 'error'

            res.status(409).render('user', {
                isFetched: isFetched,
                isSaved: isSaved,
                status: status,
                code: err.code,
                message: err.sqlMessage
            })
        })

    }).catch(err => { //api error handler
        res.status(500).render('user', {
            isFetched: isFetched,
            isSaved: isSaved,
            status: err.state,
            code: err.data['code'],
            url: err.data['url']
        })
    })
});

/** Function to handle incoming users get request,
 *  returns user data or error to user view
 *  */
router.get('/get', function(req, res, next) {

    getUserDb().then((results, error) => {
        res.json({ 'status': 'success', 'data': results })

    }).catch(err => { // db fetch error handler
        res.status(500).json({ 'status': 'error', 'data': err })

    })
})

module.exports = router;