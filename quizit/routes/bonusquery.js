var express = require('express');
var router = express.Router();
var bonusbase = require('../server/bonusbase');

router.post('/challenger',bonusbase.getbonusForChallenger);

module.exports = router;