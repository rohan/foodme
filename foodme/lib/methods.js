Meteor.methods({
  getLocalRestaurants: function(loc) {
    console.log("in a meteor method");
    console.log("startPos:", loc);

    var url = "http://api.yelp.com/v2/search";
    var auth = Accounts.loginServiceConfiguration.findOne({service: 'yelp'});

    var Yelper = Meteor.npmRequire("yelp");
    var yelper = new Yelper();

    var yelp = yelper.createClient({
      consumer_key: auth.consumerKey, 
      consumer_secret: auth.consumerSecret,
      token: auth.accessToken,
      token_secret: auth.accessTokenSecret,
    });

    yelp.search({term: "food", location: "Montreal"}, function(error, data) {
      console.log(error);
      console.log(data);
    });
  }
})