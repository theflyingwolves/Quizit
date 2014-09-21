var mongoskin = require('mongoskin');
var express = require('express');

var db = mongoskin.db('mongodb://localhost:27017/quizit?auto_reconnect', {safe:true});
var questionbase = db.collection('questionbase');
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

for(var i = 0; i < quizArray.length; i++) {
	questionbase.save({
		question: quizArray[i]
	},function(error, quiz){
   		if (error) console.log(error.message);
   		if (!quiz) console.log('Failed to save');
   		console.info('Added %s with id=%s', quiz.question, quiz._id);
	});
}

