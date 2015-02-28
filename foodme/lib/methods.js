Meteor.methods({
  getLocalRestaurants: function(e) {
    var startPos = undefined;

    currentLocation = function() {
      var geoOptions = {
        enableHighAccuracy: false
      }

      var geoSuccess = function(position) {
        startPos = position;
      };

      var geoError = function(error) {
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }();

    while (startPos === undefined) {
      console.log("waiting, startPos: ", startPos);
    }
    console.log("finished!");
  }
})