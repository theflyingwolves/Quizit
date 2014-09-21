exports.list = function(req, res, next){
  req.db.questionbase.find({}).toArray(function(error, questionbase){
    if (error) return next(error);
    res.send(questionbase);
  });
};

exports.contributeQuestion = function(req, res, next){
  if (!req.body || !req.body.name) return next(new Error('No question data provided.'));
  req.db.questionbase.save({
    question: req.body.name,
  }, function(error, quiz){
    if (error) return next(error);
    if (!quiz) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', quiz.question, quiz._id);
    res.redirect('/');
  })
};

exports.recordChallenge = function(req, res, next){
  if(!req.body || !req.body.challengerID || !req.body.challengeeID || !req.body.result) 
    return next(new Error('No challenges data provided'));
  req.db.challengebase.save({
    challengerID: req.body.challengerID,
    challengeeID: req.body.challengeeID,
    result: req.body.result
  }, function(error, challenge) {
      if (error) return next(error);
      if (!challenge) return next(new Error('Failed to save challenges.'));
      res.send("added challenges");
      console.info('Added %s with id=%s', challenge.result, challenge._id);
  })
};

exports.getYouKnowBest = function(req, res, next) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  req.db.challengebase.find({challengerID: query.challengerID}).sort({"result": -1}).limit(1).toArray(function(error, challengebase){
    if (error) return next(error);
    res.send(challengebase);
  })
}

exports.getKnowYouBest = function(req, res, next) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  req.db.challengebase.find({challengeeID: query.challengeeID}).sort({"result": -1}).limit(1).toArray(function(error, challengebase){
    if (error) return next(error);
    res.send(challengebase);
  })
}