Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('default');
});

Router.route('/admin', function () {
  this.render('admin');
});
