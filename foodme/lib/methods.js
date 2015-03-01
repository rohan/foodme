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
})