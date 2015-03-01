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

  groupAdd: function(restaurant, time, size) {
    console.log("hello!");

    var person = this.userId !== null? this.userId : "";
    console.log(person);

  	// TODO: use $in to make time and size ranges
    var groups, retCode = 0;
    var iTime = parseInt(time, 10),
    	iSize = parseInt(size, 10);
    var minTime = iTime - 15;
    var maxTime = iTime + 15;
    var minSize = iSize - 2;
    var maxSize = iSize + 2;

    groups = Groups.find({restaurant: restaurant, time: time, size: size}); // findOne instead?
    // TODO - add Meteor.userId() to the group^ here
    
    if (groups.count() == 0) {
      console.log("couldn't find any groups which matched exactly");
    	retCode = 1;
    	groups = Groups.find(
    		{ $and : [
          {restaurant: restaurant, time: time},
          {size: {$gte: minSize}},
          {size: {$lte: maxSize}}
    		]}
    	)
    } else {
      console.log("found a group which matched exactly", groups.fetch());
      Groups.update({restaurant: restaurant, time: time, size: size}, {$addToSet: {people: person}});
      return retCode; 
    }

    if (groups.count() == 0) {
      console.log("couldn't find any groups with size in the range")
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
      console.log("couldn't find any groups with time or size in range, inserting");
    	retCode = 3;

    	Groups.insert({
    		restaurant: restaurant,
    		time: time,
    		size: size,
    		people: [person]
    	});
    }

    return retCode;
  }
})
