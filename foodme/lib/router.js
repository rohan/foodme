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

Router.route('group/:_id', function() {
  var group = Groups.find({_id: this.params._id});
  this.render('showGroup', {data: group});
});

Router.route('group-list', function() {
  var query = this.params.query;
  Meteor.call("findGroups", query.name, parseInt(query.time, 10), 
              parseInt(query.size, 10), Boolean(query.timeRange), 
              Boolean(query.sizeRange), function(groups) {
                this.render('groupList', {data: groups}); 
              });
});

Router.route('submit-group', {where: 'server'}).post(function() {
  var body = this.request.body;
  var old_this = this;
  var name = body['restaurant-name'];
  var size = body['group-size'];
  var time = body['date-time'];
  Meteor.call("groupAdd",  name, size, time, function(err, res) {
    var queryObj = {query: {name: name, size: size, time: time, sizeRange: res > 0, timeRange: res > 1}};
    if (res == 0 || res == 3) {
      	Router.go('group', {id: 0}, {}); //TODO
    } else if(res == 1){
      	Router.go('group-list', {}, queryObj);
    } else if (res == 2){
      	Router.go('group-list', {}, queryObj);
    }
  });
});

Router.route('groups/:_id', function() {
  this.render('group-page', {data: {a: 'b'}});
});
