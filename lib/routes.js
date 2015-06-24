Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  Session.set('showRemoveAttendeeButtons', false);
  this.render('default');
});

Router.route('/admin', function () {
  Session.set('showRemoveAttendeeButtons', true);
  this.render('admin');
});
