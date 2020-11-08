/**
 * Node.js script to handle home get request.
 */
var express = require('express');
var router = express.Router();

// handles incoming get request, returns home page
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Affluent task' });
});

module.exports = router;