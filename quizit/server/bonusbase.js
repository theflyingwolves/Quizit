var bonusbasequery = {};

var dummybonusdata = [
	{
		"player_id":"745105835527392",
		"target_id":"770989079621315",
		"bonus":[{
			"question_id":"541c1a946837a40a13114846",
			"reply":"ignored",
		},
		
		{
			"question_id":"541c19e639e965a74f53ebe4",
			"status":"unverified"
		}]
	},

	{
		"player_id":"767253243336231",
		"target_id":"745105835527392",
		"bonus":[{
			"question_id":"541c1a946837a40a13114846",
			"reply":"N",
			"status":"verified"
		},

		{
			"question_id":"541c19e639e965a74f53ebe4",
			"status":"unverified"

		}]
	}
];

bonusbasequery.init = function(req,res,next){
	req.db.bonusbase.drop();
	req.db.bonusbase.insert(dummybonusdata,function(error,bonus){
		if (error) return next(error);
		if (!bonus) return next(new Error('Failed to save.'));
		console.log("All bonus challenges Successfully Saved");
	})
};

bonusbasequery.getbonus = function(req,res,next){
	var db = req.db.bonusbase;
	var player_id = req.body.player_id;
	var target_id = req.body.target_id;

	db.find({
		player_id:player_id,
		target_id:target_id
	}).toArray(function(error, bonusbase){
    if (error) return next(error);
		res.send(bonusbase);
  });

};

bonusbasequery.getbonusForPlayer = function(req,res,next){
	var db = req.db.bonusbase;
	var player_id = req.body.player_id;

	db.find({
		"player_id":player_id,
		status: "verified"
	}).toArray(function(error,data){
		if (error) return next(error);
		res.send(data);
	});
};

bonusbasequery.getbonusForTarget = function(req,res,next){
	var db = req.db.bonusbase;
	var target_id = req.body.target_id;

	db.find({
		"target_id":target_id,
		status: "unverified"
	}).toArray(function(error,data){
		if (error) return next(error);
		res.send(data);
	});
};

bonusbasequery.addbonus = function(req,res,next){
	console.log("addbonus");
	var db = req.db.bonusbase;
	var player_id = req.body.player_id;
	var target_id = req.body.target_id;
	var bonusToAdd = {
		"player_id": player_id,
		"target_id": target_id,
		"bonus": req.body.bonus
	}
	console.log("id "+player_id+" "+target_id);
	db.find({
		"player_id":player_id,
		"target_id":target_id
	}).toArray(function(error,entry){
		if(entry.length == 0){
			db.insert(bonusToAdd,function(err, data){});
			res.send("bonus added");

			
		}else{
			var bonusArray = req.body.bonus;
			db.update({
				"player_id":player_id,
				"target_id":target_id
			},
			{
				"$push":{
					"bonus":{"$each":bonusArray}
				}
			});
			res.send("bonus added");
		}
	});
};



module.exports = bonusbasequery;