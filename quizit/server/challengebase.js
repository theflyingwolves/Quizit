var challengebase = {};

var challengeDummyData = [
	{ 
		"challengerID" : "541b0188227d77f51afed102", 
		"challengeeID" : "541c3562e85200620d9fdef9", 
		"result" : "80", 
	},

	{ 
		"challengerID" : "541b0188227d77f51afed102", 
		"challengeeID" : "541c3562e85200620d9fdef8",
		"result" : "50",
	},

	{
		"challengerID" : "541c3562e85200620d9fdef8", 
		"challengeeID" : "541b0188227d77f51afed102", 
		"result" : "60", 
	}
];

challengebase.init = function(req,res,next){
	req.db.challengebase.drop();
	req.db.challengebase.insert(challengeDummyData, function(error,bonus){
		if (error) return next(error);
		if (!bonus) return next(new Error('Failed to save.'));
		console.log("All challenge data Successfully Saved");
	})
}

challengebase.recordChallenge = function(req, res, next){
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

challengebase.getYouKnowBest = function(req, res, next) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  req.db.challengebase.find({challengerID: query.challengerID}).
    sort({"result": -1}).limit(1).toArray(function(error, challengebase){
    if (error) return next(error);
    res.send(challengebase);
  })
}

challengebase.getKnowYouBest = function(req, res, next) {
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  req.db.challengebase.find({challengeeID: query.challengeeID}).
    sort({"result": -1}).limit(1).toArray(function(error, challengebase){
    if (error) return next(error);
    res.send(challengebase);
  })
}

module.exports = challengebase;