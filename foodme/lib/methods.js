Meteor.methods({
  getLocalRestaurants: function(loc) {
    var auth = Accounts.loginServiceConfiguration.findOne({service: 'yelp'});

    var yelp = Meteor.npmRequire("yelp").createClient({
      consumer_key: auth.consumerKey, 
      consumer_secret: auth.consumerSecret,
      token: auth.accessToken,
      token_secret: auth.accessTokenSecret,
    });

    var ll = loc.latitude + "," + loc.longitude;

    var a_search = Async.wrap(yelp, "search");

    var res = a_search({term: "food", ll: ll, limit: 5});
    return res;
  },

  groupAdd: function(person, restaurant, time, size) {

  	// TODO: use $in to make time and size ranges
    var groups, retCode = 0;
    const minTime = time - 15, maxTime = time + 15,
    	minSize = size - 2, maxSize = size + 2;

    groups = Groups.find({restaurant: restaurant, time: time, size: size}); // findOne instead?
    // TODO - add Meteor.userId() to the group^ here
    
    if (groups.count() == 0) {
    	retCode = 1;
    	groups = Groups.find(
    		{ $and : [
    		{restaurant: restaurant, time: time},
    		{size: {$gte: minSize}},
    		{size: {$lte: maxSize}}
    		]}
    	)
    }

    if (groups.count() == 0) {
    	retCode = 2;
    	groups = Groups.find(
    		{ $and : [
    		{restaurant: restaurant},
    		{time: {$gte: minTime}},
    		{time: {$lte: maxTime}},
    		{size: {$gte: minSize}},
    		{size: {$lte: maxSize}}
    		]}
    	)
    }

    if(groups.count() == 0) {
    	retCode = 3;

    	Groups.insert({
    		restaurant: restaurant,
    		time: time,
    		size: size,
    		people: [Meteor.userId()]
    	});
    }

    return {groups: groups, code: retCode};
  }
})