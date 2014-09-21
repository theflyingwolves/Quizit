var express = require('express');
var router = express.Router();
var challengebase = require('../server/challengebase');

router.post('/', challengebase.recordChallenge);
router.get('/youknowbest', challengebase.getYouKnowBest);
router.get('/knowyoubest', challengebase.getKnowYouBest);

module.exports = router;