exports.userbaseinit = function(req,res,next){
	var dummyusers = [{
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

	req.db.userbase.insert(dummyusers,function(error,users){
		if (error) return next(error);
		if (!users) return next(new Error('Failed to save.'));
		console.log("All Users Successfully Saved");
		res.redirect("/");
	});
};