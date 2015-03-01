Router.configure({
  layoutTemplate: "layout"
});

<<<<<<< HEAD
Router.route('/', "restaurantList");
=======
Router.route('/', 'landing');
var pages = ['register', 'new-restaurant', 'find-group'];

pages.forEach(function(page) {
  Router.route(page, page);
});

>>>>>>> 67bb595f987f6b4243889784b778353a5538093c
