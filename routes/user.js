var express = require('express');
var router = express.Router();
const axios = require('axios');
const Mysqldb = require('../models/mysqldb');

let isFetched = 'false'
let status = 'false'

/**
 * Remap [{},{},{}...] to [[],[],[]...],
 * so it can be inserted at once to MySQL db
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

var saveUsers = function(user) {
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

        }).catch(err => {
            reject({ 'state': 'error', 'data': { 'code': err.code, 'url': err.config['url'] } })
        })
    })

}

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

/* GET users listing. */
router.get('/', function(req, res, next) {

    isFetched = false
    isSaved = false
    status = 'success'

    fetchUsers('https://reqres.in/api/users', 'page').then((fetchedUsers, error) => {
        isFetched = true;
        saveUsers(fetchedUsers.data).then((success, error) => {
            isSaved = true
            res.render('user', {
                isFetched: isFetched,
                isSaved: isSaved,
                status: status,

            })
        }).catch(err => { //db error
            isSaved = false
            status = 'error'
            res.render('user', {
                isFetched: isFetched,
                isSaved: isSaved,
                status: status,
                code: err.code,
                message: err.sqlMessage
            })
        })

    }).catch(err => { //api error
        res.render('user', {
            isFetched: isFetched,
            isSaved: isSaved,
            status: err.state,
            code: err.data['code'],
            url: err.data['url']
        })
    })
});

router.get('/get', function(req, res, next) {

    getUserDb().then((results, error) => {

        res.json({ 'status': 'success', 'data': results })

    }).catch(err => {

        console.log("Get DB error", err)
        res.json({ 'status': 'error', 'data': { err } })

    })
})

module.exports = router;