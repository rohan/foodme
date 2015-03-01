Template.newGroup.helpers({
  retCode: function() {
    return Session.get("retCode");
  },
  message: function() {
    var retCode = Session.get("retCode");
    switch(retCode) {
      case 0: case 3:
        return "Sit tight, we're finding great food for you";
      case 1:
        return "Found some groups at the same time with similar sizes.";
      case 2:
        return "Found some groups eating at similar times with similar sizes.";
      default:
        return "Loading";
    }
  }
});



Template.newGroup.events({
  "click .checkbox" : function(evt, template) {
    template.$('input[type=checkbox]').click();
  },

  "submit form": function(e) {
    e.preventDefault();
    var target = e.target; // restaurant-name, group-size, date-time, only-friends
    var restaurant_name = $(target["restaurant-name"]).val();
    var group_size = $(target["group-size"]).val();
    var date_time = $(target["date-time"]).val();
    var friends = $(target["only-friends"]).prop("checked");

    $('.loading').removeClass('hidden');
    $('.loading').addClass('active');
    $('.loader').addClass('active');

    Meteor.call("groupAdd", restaurant_name, group_size, date_time, function (err, res) {
      Session.set("retCode", res);
    });

    return false;
  }
});
