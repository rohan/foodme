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
  	var idTemp = 0;
    if (res == 0 || res == 3) {
      	Router.go('group', {id: idTemp}, {});
    } else {
    	var iSize = parseInt(body['group-size'], 10),
    		iTime = parseInt(body['date-time'], 10),
    		maxSize = iSize + 2, minSize = iSize - 2,
    		maxTime = iTime - 15, minTime = iTime + 15;
      	Router.go('group-list', {}, {query: { $and [
     		{restaurant: body['restaurant-name'},
     		// TODO - only include the time range if res == 2
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