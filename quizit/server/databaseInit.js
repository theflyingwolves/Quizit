var userbase = require("./userbase");
var bonusbase = require("./bonusbase");

var dummyDB = {};

dummyDB.init = function(req,res,next){
	userbase.init(req,res,next);
	bonusbase.init(req,res,next);
};

module.exports = dummyDB;