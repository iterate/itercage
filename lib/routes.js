Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('default');
});

Router.route('/admin', function () {
  this.render('admin');
});

Router.route('/:_hash', function () {
  Meteor.call('addAttendeeByHash', this.params._hash, function (error) {
    if (error) {
      FlashMessages.sendError('For mange påmeldte. Kontakt truls@iterate.no dersom du vil være med.');
    }
  });

  this.redirect('/');
});
