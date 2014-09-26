var userbasequery = {};

var dummyusers = [
{
	"facebook_account":"767253243336231",
	"profile":{
		"name":"Wang Kunzhen",
		"sex":"male",
		"birthday":"1993-05-20",
		"marital_status":"single",
		"genre":"student",
		"interest":["badminton","programming","singing"]
	},
	"questions":[{
		"questionID":1,
		"answer":"Y"
	},
	{
		"questionID":3,
		"answer":"N"
	},
	{
		"questionID":5,
		"answer":"Y"
	}],
	"notification":[]
},

{
	"facebook_account":"770989079621315",
	"profile":{
		"name":"Wang Yichao",
		"sex":"male",
		"birthday":"1992-12-14",
		"marital_status":"married",
		"genre":"student",
		"interest":["programming","singing","reading"]
	},
	"questions":[{
		"questionID":2,
		"answer":"N"
	},
	{
		"questionID":4,
		"answer":"N"
	},
	{
		"questionID":7,
		"answer":"Y"
	}],
	"notification":[]
},

{
	"facebook_account":"745105835527392",
	"profile":{
		"name":"Xia Yiping",
		"sex":"female",
		"birthday":"1993-01-01",
		"marital_status":"single",
		"genre":"student",
		"interest":["badminton","drawing","running"]
	},
	"questions":[{
		"questionID":2,
		"answer":"Y"
	},
	{
		"questionID":3,
		"answer":"Y"
	},
	{
		"questionID":6,
		"answer":"Y"
	}],
	"notification":[]
}
];

userbasequery.init = function(req,res,next){
	req.db.userbase.drop();
	req.db.userbase.insert(dummyusers,function(error,users){
		if (error) return next(error);
		if (!users) return next(new Error('Failed to save.'));
		console.log("All Users Successfully Saved");
	});
};

userbasequery.login = function(req,res,next){
	var facebook_account = req.body.facebook_account;
	var password = req.body.password;
	req.db.userbase.find({"facebook_account":facebook_account,"password":password}).toArray(function(error,data){
		if(data.length == 0){
			res.cookie('user',{'status':'failed','facebook_account':facebook_account});
		}else{
			res.cookie('user',{'status':'successful','facebook_account':facebook_account});
		}

		res.redirect('/userLoginRedirect');
	});
}

userbasequery.userLoginRedirect = function(req,res,next){
	var loginStatus = req.cookies.user;
	if(loginStatus.status == 'successful'){
		res.send("Logged in Successfully as: "+loginStatus.facebook_account);	
	}else{
		res.send("User "+loginStatus.facebook_account+" does not exists, Please try again.");
	}
}


userbasequery.getProfile = function(req, res, next) {
	var url = require('url');
  	var url_parts = url.parse(req.url, true);
  	var query = url_parts.query;
	req.db.userbase.find({"facebook_account":query.userid}).toArray(function(error,user){
		res.send(user.profile);
	});
}


/***********question*************/

userbasequery.getQuestions = function(req,res, next){
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  req.db.userbase.find({facebook_account: query.fb_account}).toArray(function(error, userInfo){
    if (error) return next(error);
    if(userInfo.length == 0) {
    	return next(error);
	}
    var generatedQuestions = generateQuestions(userInfo[0].profile);

    var questionIDs = [];
    var answers = [];
    for(var i = 0; i < userInfo[0].questions.length; i++) {
    	var ques_ans = userInfo[0].questions[i];
    	questionIDs[questionIDs.length] = {
    		qid: ques_ans.questionID
    	};
    	answers[answers.length] = ques_ans.answer;
    }
    retrieveQuestions(req, res, generatedQuestions, questionIDs, answers );
  })
}

var retrieveQuestions = function(req, res, generatedQuestions, questionIDs, answers){
	console.log(questionIDs);
	console.log(answers);
	req.db.questionbase.find({$or: questionIDs}).toArray(function(error, questionData){
    	if (error) return next(error);

    	var ques_ans = [];
    	for (var i = 0; i < questionData.length; i++){
    		ques_ans[ques_ans.length]={
    			question: questionData[i].question,
    			answer: answers[i]
    		};
    	};
    	ques_ans.push.apply(ques_ans, generatedQuestions);
    	res.send(ques_ans);
	})
}


var generateQuestions = function(user_profile) {
	var questions = [];
	var user_interests = user_profile.interest;
	var numInterests = user_interests.length>5?5:user_interests.length
	questions[0] = {
		question: "Is my birthday "+user_profile.birthday+"?",
		answer: "Y"
	};
	for(var i=0;i<numInterests;i++){
		var question = {
			question: "Do I like "+user_interests[i]+"?",
			answer: "Y"
		}
		questions[questions.length] = question;
	}
	return questions;
}


module.exports = userbasequery;