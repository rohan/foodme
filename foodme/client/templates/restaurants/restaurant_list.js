Template.restaurantList.helpers({
  currentLocation: function() {
    return Meteor.call("getLocalRestaurants");
  }
})