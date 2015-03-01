Session.set("restaurants", null);

Template.restaurantList.helpers({
  localRestaurants: function() {
    return Session.get("restaurants");
  }
});

Template.restaurantList.created = function() {
  navigator.geolocation.getCurrentPosition(function(loc) {
    Meteor.call("getLocalRestaurants", loc.coords, function(err, res) {
      Session.set("restaurants", res.businesses);
    });
  });
}
