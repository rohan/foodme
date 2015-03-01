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
  Meteor.call("groupAdd", body['restaurant-name'], body['group-size'], body['date-time'], function(err, res) {

    var iSize = parseInt(body['group-size'], 10),
    	iTime = parseInt(body['date-time'], 10),
    	maxSize = iSize + 2, minSize = iSize - 2,
    	maxTime = iTime - 15, minTime = iTime + 15;
  	var idTemp = 0;
    if (res == 0 || res == 3) {
      	Router.go('group', {id: idTemp}, {});
    } else if(res == 1){
      	Router.go('group-list', {}, {query: { $and : [
     		{restaurant: body['restaurant-name']},
     		{time: iTime},
          	{size: {$gte: minSize}},
          	{size: {$lte: maxSize}}
     	]}
     	});
    } else if (res == 2){
      	Router.go('group-list', {}, {query: { $and : [
     		{restaurant: body['restaurant-name']},
     		{time: {$gte: minTime}},
          	{time: {$lte: maxTime}},
          	{size: {$gte: minSize}},
          	{size: {$lte: maxSize}}
     	]}
     	});
    }
  });
});

Router.route('groups/:_id', function() {
  this.render('group-page', {data: {a: 'b'}});
});