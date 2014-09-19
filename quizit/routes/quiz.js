


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
}