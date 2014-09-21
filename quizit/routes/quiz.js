var express = require('express');
var router = express.Router();
var questionbase = require('../server/questionbase');

router.get('/',questionbase.listQuestions);
router.post('/contribute',questionbase.contributeQuestion);

module.exports = router;