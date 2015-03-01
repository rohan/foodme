Template.groupList.helpers({
  id: function() {
    return Meteor.userId();
  },
  time: function(datetime) {
    return moment(datetime * 1000).toString();
  }
});
