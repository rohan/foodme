var TIME_RANGE = 15;
var SIZE_RANGE = 2;

var _findGroups = function(name, time, size, timeRange, sizeRange) {
  console.log("Hello!", name, time, size);
  if (!timeRange && !sizeRange) {
    return Groups.find({restaurant: name, time: time, size: size}).fetch();
  } else if (!timeRange && sizeRange) {
    return Groups.find({$and : [
      {restaurant: name, time: time},
      {size: {$gte: size - SIZE_RANGE, $lte: size + SIZE_RANGE}}
      ]
    }).fetch();
  } else if (timeRange && !sizeRange) {
    // this never happens
    return Groups.find({ $and : [
      {restaurant: name, size: size},
      {time: {$gte: time - TIME_RANGE, $lte: time + TIME_RANGE}}
      ]
    }).fetch();   
  } else {
    return Groups.find({ $and : [
      {restaurant: name},
      {time: {$gte: time - TIME_RANGE, $lte: time + TIME_RANGE}},
      {size: {$gte: size - SIZE_RANGE, $lte: size + SIZE_RANGE}}
      ]
    }).fetch();
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

  findGroups: function(name, time, size, timeRange, sizeRange) {
    var out = _findGroups(name, time, size, timeRange, sizeRange);
    console.log("Goodbye!");
    return out;
  },

  groupAdd: function(restaurant, sTime, sSize) {
    var person = this.userId !== null? this.userId : "";

    var groups, retCode = 0;
    var time = parseInt(sTime, 10);
    var size = parseInt(sSize, 10);

    groups = _findGroups(restaurant, time, size, false, false);
    // TODO - add Meteor.userId() to the group^ here
    
    if (groups.length == 0) {
      console.log("couldn't find any groups which matched exactlyish");
      retCode = 1;
      groups = _findGroups(restaurant, time, size, false, true);
    } else {
      console.log("found a group which matched exactly", groups.fetch());
      var group_id = groups[0]._id;
      Groups.update({restaurant: restaurant, time: time, size: size}, {$addToSet: {people: person}});
      return {id: group_id, retCode: retCode}; 
    }

    if (groups.length == 0) {
      console.log("couldn't find any groups with size in the range")
      retCode = 2;
      groups = _findGroups(restaurant, time, size, true, true);
    }

    if (groups.length == 0) {
      console.log("couldn't find any groups with time or size in range, inserting");
      retCode = 3;

      Groups.insert({
        restaurant: restaurant,
        time: time,
        size: size,
        people: [person]
      });
    }

    var group_id = groups[0]._id;
    var out = {id: group_id, retCode: retCode};
    return out;
  }
})
