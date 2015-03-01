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
  var old_this = this;
  console.log("query object", query);
  Meteor.call("findGroups", query.name, parseInt(query.time, 10), 
              parseInt(query.size, 10), Boolean(query.timeRange), 
              Boolean(query.sizeRange), function(err, res) {
                console.log(err);
                console.log(res);
                old_this.render('groupList', {data: res});
              });
});

Router.route('submit-group', {where: 'server'}).post(function() {
  var body = this.request.body;
  var old_this = this;
  var name = body['restaurant-name'];
  var size = body['group-size'];
  var time = body['date-time'];
  Meteor.call("groupAdd", name, size, time, function(err, res) {
    var code = res["retCode"];
    var id = res["id"];
    var queryObj = {query: {name: name, size: size, time: time, sizeRange: code > 0, timeRange: code > 1}};
    if (code == 0 || code == 3) {
      	Router.go('show-group', {id: id}, {}); //TODO
    } else if(code == 1) {
      old_this.response.writeHead(302, {
        'Location': '/group-list?name=' + name + '&size=' + size + 
            '&time=' + time + '&sizeRange=' + (code > 0) + '&timeRange=' + (code > 1)
      });
      old_this.response.end();
    } else if (code == 2){
      	Router.go('group-list', queryObj, {});
    }
  });
});

Router.route('groups/:_id', function() {
  this.render('group-page', {data: {a: 'b'}});
});
