var questionbase = {};

var quizArray = [
	"Do you wear slippers to school or work?",
	"Do you like Sushi?",
	"Do you play basketball?",
	"Can you swim?",
	"Are you a vegeterian?",
	"Do you know Calculas?",
	"Do you take two showers everyday?",
	"Do you watch World Cup?",
	"Do you prefer PC games to mobile games?",
	"Do you play Candy Crush?",
	"Do you often wear jeans?",
	"Do you sleep more than 7 hours per day?"
];

questionbase.init = function(req,res,next){
	req.db.questionbase.drop();
	for(var i = 0; i < quizArray.length; i++) {
		req.db.questionbase.save({
			question: quizArray[i]
		},function(error, quiz){
	   		if (error) console.log(error.message);
	   		if (!quiz) console.log('Failed to save');
	   		// console.info('Added %s with id=%s', quiz.question, quiz._id);
		});
	}
	console.log("All quizes Successfully Saved");
}

questionbase.listQuestions = function(req, res, next){
  req.db.questionbase.find().toArray(function(error, questionbase){
    if (error) return next(error);
    res.send(questionbase);
  });
};

questionbase.contributeQuestion = function(req, res, next){
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

module.exports = questionbase;