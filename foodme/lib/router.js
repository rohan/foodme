Router.configure({
  layoutTemplate: "layout"
});

Router.route('/', 'landing');

Router.route('new-group', 'newGroup');

Router.route('find-group', function() {
  this.render('findGroup', 
    { data: 
      { groups: 
        [{_id: 0, name: 'Robot Unicorn Attack', description: 'Pure hilarity'}, 
         {_id: 1, name: 'Ben Stern\'s Economics class', description: 'Serious business'}]
        .map(function(elem, index) {
          elem.index = index + 1;
          return elem;
        })
      }
    });
});

Router.route('submit-group', {where: 'server'}).post(function() {
  var body = this.request.body;
  var old_this = this;
  Meteor.call("groupAdd", body['restaurant-name'], body['group-size'], body['date-time'], function(err, res) {
    if (res == 0 || res == 3) {
      Router.go();
    } else {
      Router.go();
    }
  });
});

Router.route('groups/:_id', function() {
  this.render('group-page', {data: {a: 'b'}});
});
