var bonusbasequery = {};

var dummybonusdata = [
	{
		"challenger_id":"541c2d26920a3f5f145e9bcd",
		"challengee_id":"541c2d26920a3f5f145e9bcc",
		"bonus":[{
			"question_id":"541c1a946837a40a13114846",
			"choice":"Y",
			"result":"positive",
			"status":"verified"
		},

		{
			"question_id":"541c19e639e965a74f53ebe4",
			"choice":"Y",
			"result":"",
			"status":"unverified"
		}]
	},

	{
		"challenger_id":"541c2d1f920a3f5f145e9bc8",
		"challengee_id":"541c2d26920a3f5f145e9bcd",
		"bonus":[{
			"question_id":"541c1a946837a40a13114846",
			"choice":"Y",
			"result":"negative",
			"status":"verified"
		},

		{
			"question_id":"541c19e639e965a74f53ebe4",
			"choice":"Y",
			"result":"positive",
			"status":"verified"
		}]
	}
];

bonusbasequery.init = function(req,res,next){
	var db = req.db.bonusbase;
	db.insert(dummybonusdata,function(error,bonus){
		if (error) return next(error);
		if (!bonus) return next(new Error('Failed to save.'));
		console.log("All Users Successfully Saved");
		res.redirect("/");
	})
};

bonusbasequery.getbonus = function(req,res,next){
	var db = req.db.bonusbase;
	var challenger_id = req.body.challenger_id;
	var challengee_id = req.body.challengee_id;

	var result = db.find({
		"challenger_id":challenger_id,
		"challengee_id":challengee_id
	});

	res.send(result);
};

bonusbasequery.getbonusForChallenger = function(req,res,next){
	var db = req.db.bonusbase;
	var challenger_id = req.body.challenger_id;

	var result = db.find({
		"challenger_id":challenger_id
	});

	res.send(result);
};


bonusbasequery.getbonusForChallengee = function(req,res,next){
	var db = req.db.bonusbase;
	var challengee_id = req.body.challengee_id;

	var result = db.find({
		"challengee_id":challengee_id
	});

	res.send(result);
};

bonusbasequery.addbonus = function(req,res,next){
	var db = req.db.bonusbase;
	var bonusToAdd = req.body.bonusToAdd
	var challenger_id = bonusToAdd.challenger_id;
	var challengee_id = bonusToAdd.challengee_id;

	var entry = db.find({
		"challenger_id":challenger_id,
		"challengee_id":challengee_id
	});

	if(entry.length == 0){
		db.insert(bonusToAdd);
	}else{
		var bonusArray = bonusToAdd.bonus;
		db.update({
			"challenger_id":challenger_id,
			"challengee_id":challengee_id
		},
		{
			"$push":{
				"bonus":{"$each",bonusArray}
			}
		});
	}
};

module.exports = bonusbasequery;