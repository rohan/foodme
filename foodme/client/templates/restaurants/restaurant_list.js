Template.restaurantList.helpers({
  currentLocation: function() {
    navigator.geolocation.getCurrentPosition(function(loc) {
      console.log(loc);
      Meteor.call("getLocalRestaurants", loc.coords);
    });
    //Meteor.call("getLocalRestaurants");
  }
})