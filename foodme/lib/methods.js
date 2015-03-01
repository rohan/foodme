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
    var groups = Groups.find({restaurant: restaurant, time: time, size: size}); // findOne instead?
    // TODO - add Meteor.userId() to the group^ here
    if (groups.count() == 0) {
    	Goups.insert({
    		restaurant: restaurant,
    		time: time,
    		size: size,
    		people: [Meteor.userId()]
    	});
    }
  }
})