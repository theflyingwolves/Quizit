var express = require('express');
var router = express.Router();
var bonusbase = require('../server/bonusbase');

router.post('/',bonusbase.addbonus);
router.get('/target',bonusbase.getbonusForTarget);
router.get('/player', bonusbase.getbonusForPlayer);

module.exports = router;