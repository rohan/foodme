Template.newGroup.helpers({
  retCode: Session.get("retCode"),
});

Template.newGroup.events({
  "click .checkbox" : function(evt, template) {
    template.$('input[type=checkbox]').click();
  },

  "click .message .close" : function(evt, template) {
    $('.message .close').on('click', function() {
      $(this).closest('.message').fadeOut();
    });
  },

  "submit form": function(e) {
    e.preventDefault();
    console.log("submitted");
    var target = e.target; // restaurant-name, group-size, date-time, only-friends
    var restaurant_name = $(target["restaurant-name"]).val();
    var group_size = $(target["group-size"]).val();
    var date_time = $(target["date-time"]).val();
    var friends = $(target["only-friends"]).prop("checked");

    Meteor.call("groupAdd", restaurant_name, group_size, date_time, function (err, res) {
      Session.set("retCode", res);
      $('.message').show();
    });

    return false;
  }
});