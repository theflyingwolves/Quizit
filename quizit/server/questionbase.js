var questionbase = {};

var quizArray = [
	{qid: 1, question: "Do you wear slippers to school or work?"},
	{qid: 2, question: "Do you like Sushi?"},
	{qid: 3, question: "Do you play basketball?"},
	{qid: 4, question: "Can you swim?"},
	{qid: 5, question: "Are you a vegeterian?"},
	{qid: 6, question: "Do you know Calculas?"},
	{qid: 7, question: "Do you take two showers everyday?"},
	{qid: 8, question: "Do you watch World Cup?"},
	{qid: 9, question: "Do you prefer PC games to mobile games?"},
	{qid: 10, question: "Do you play Candy Crush?"},
	{qid: 11, question: "Do you often wear jeans?"},
	{qid: 12, question: "Do you sleep more than 7 hours per day?"}
];

questionbase.init = function(req,res,next){
	req.db.questionbase.drop();
	for(var i = 0; i < quizArray.length; i++) {
		req.db.questionbase.save({
			qid: quizArray[i].qid,
			question: quizArray[i].question
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
    question: req.body.name
  }, function(error, quiz){
    if (error) return next(error);
    if (!quiz) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', quiz.question, quiz._id);
    res.redirect('/');
  })
}

questionbase.getBonus = function(req, res, next){
	req.db.questionbase.count(function(err, count){
		var randNum = Math.floor(Math.random()*count);
		console.log("count "+count+"rand: "+randNum);
		
		req.db.questionbase.find().limit(1).skip(randNum).next(function(error, data){
			res.send(data);
		});
  });
}

module.exports = questionbase;