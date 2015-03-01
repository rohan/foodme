var TIME_RANGE = 15;
var SIZE_RANGE = 2;

var findGroups = function(name, time, size, timeRange, sizeRange) {
  if (!timeRange && !sizeRange) {
    return Groups.find({restaurant: name, time: time, size: size});
  } else if (!timeRange && sizeRange) {
    return Groups.find({ $and : [
          {restaurant: restaurant, time: time},
          {size: {$gte: size - SIZE_RANGE, $lte: size + SIZE_RANGE}}
    		]
      });
  } else if (timeRange && !sizeRange) {
    return Groups.find({ $and : [
          {restaurant: restaurant, size: size},
          {time: {$gte: time - TIME_RANGE, $lte: time + TIME_RANGE}}
    		]
      });   
  } else {
    return Groups.find({ $and : [
          {restaurant: restaurant},
          {time: {$gte: time - TIME_RANGE, $lte: time + TIME_RANGE}},
          {size: {$gte: size - SIZE_RANGE, $lte: size + SIZE_RANGE}}
        ]
      });
  }
};

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

  groupAdd: function(restaurant, sTime, sSize) {
    var person = this.userId !== null? this.userId : "";

  	// TODO: use $in to make time and size ranges
    var groups, retCode = 0;
    var time = parseInt(sTime, 10);
    var size = parseInt(sSize, 10);

    groups = findGroups(restaurant, time, size, false, false);
    // TODO - add Meteor.userId() to the group^ here
    
    if (groups.count() == 0) {
      console.log("couldn't find any groups which matched exactly");
    	retCode = 1;
    	groups = findGroups(restaurant, time, size, false, true);
    } else {
      console.log("found a group which matched exactly", groups.fetch());
      Groups.update({restaurant: restaurant, time: time, size: size}, {$addToSet: {people: person}});
      return retCode; 
    }

    if (groups.count() == 0) {
      console.log("couldn't find any groups with size in the range")
    	retCode = 2;
    	groups = findGroups(restaurant, time, size, true, true);
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
