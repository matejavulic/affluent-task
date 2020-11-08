/**
 * Node.js script to handle show fetched data get request 
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('dashboard')
})

module.exports = router;