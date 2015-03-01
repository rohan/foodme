Router.configure({
  layoutTemplate: "layout"
});

Router.route('/', 'Landing');

Router.route('new-group', 'NewGroup');

Router.route('find-group', function() {
  this.render('FindGroup', 
    { data: {groups: [{name: 'Robot Unicorn Attack', description: 'Pure hilarity'}, {name: 'Ben Stern\'s Economics class', description: 'Serious business'}].map(function(elem, index) {
      elem.index = index + 1;
      return elem;
    })}});
});

Router.route('groups/:_id', function() {
  this.render('group-page', {data: {a: 'b'}});
});
