var userbasequery = {};

var dummyusers = [{
	"facebook_account":"theflyingwolves@gmail.com",
	"profile":{
		"name":"Wang Kunzhen",
		"sex":"male",
		"birthday":"1993-05-20",
		"marital_status":"single",
		"genre":"student",
		"interest":["badminton","programming","singing"]
	},
	"questions":[{
		"questionID":"541c1a946837a40a13114846",
		"answer":"Y"
	},
	{
		"questionID":"541c1a036837a40a13114845",
		"answer":"N"
	},
	{
		"questionID":"541c19e639e965a74f53ebe4",
		"answer":"Y"
	}],
	"notification":[]
},

{
	"facebook_account":"wangycbeyond@gmail.com",
	"profile":{
		"name":"Wang Yichao",
		"sex":"male",
		"birthday":"1992-12-14",
		"marital_status":"married",
		"genre":"student",
		"interest":["programming","singing","reading"]
	},
	"questions":[{
		"questionID":"541c1a946837a40a13114846",
		"answer":"N"
	},
	{
		"questionID":"541c1a036837a40a13114845",
		"answer":"N"
	},
	{
		"questionID":"541c19e639e965a74f53ebe4",
		"answer":"Y"
	}],
	"notification":[]
},

{
	"facebook_account":"eva.xia@gmail.com",
	"profile":{
		"name":"Xia Yiping",
		"sex":"female",
		"birthday":"1993-01-01",
		"marital_status":"single",
		"genre":"student",
		"interest":["badminton","drawing","running"]
	},
	"questions":[{
		"questionID":"541c1a946837a40a13114846",
		"answer":"Y"
	},
	{
		"questionID":"541c1a036837a40a13114845",
		"answer":"Y"
	},
	{
		"questionID":"541c19e639e965a74f53ebe4",
		"answer":"Y"
	}],
	"notification":[]
}];

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

module.exports = userbasequery;