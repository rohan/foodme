Template.newGroup.events({
  "click .checkbox" : function(evt, template) {
    template.$('input[type=checkbox]').click();
  }
});
