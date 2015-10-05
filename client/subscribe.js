Meteor.subscribe('attendees', function () {
  Session.set('attendeesLoaded', true);
});
