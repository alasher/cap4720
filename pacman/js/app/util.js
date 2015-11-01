define( ['app'], function(app) {
	var util = {
		// gets random number in range [min, max]
		getRand: function(min, max) {
			return Math.floor(Math.random()*(max-min+1))+min;
		},
		
		percentChance: function(p) {
			return Math.random()*100 < p;
		},
		
		deleteNthElement: function(arr, n) {
			return arr.slice(0,n).concat(arr.slice(n+1));
		}
	};
	return util;
});