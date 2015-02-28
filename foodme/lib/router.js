Router.configure({
  layoutTemplate: "layout"
});

Router.route('/', 'landing');
var pages = ['register', 'new-restaurant', 'find-group'];

pages.forEach(function(page) {
  Router.route(page, page);
});

