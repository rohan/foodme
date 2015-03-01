Session.set("restaurants", null);

Template.restaurantList.helpers({
  localRestaurants: function() {
    return Session.get("restaurants");
  }
});

Template.restaurantList.created = function() {
  console.log("Hello!");
  navigator.geolocation.getCurrentPosition(function(loc) {
    Meteor.call("getLocalRestaurants", loc.coords, function(err, res) {
      console.log("result:", res);
      Session.set("restaurants", res.businesses);
    });
  });
}