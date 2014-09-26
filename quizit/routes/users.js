var express = require('express');
var router = express.Router();
var userbase = require('../server/userbase');


/* GET users listing. */
router.get('/',userbase.getProfile);

module.exports = router;