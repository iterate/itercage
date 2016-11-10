Meteor.subscribe('attendees', function () {
  Session.set('attendeesLoaded', true);
});

Meteor.subscribe('nonAttendees', Session.get('storedPassword'));
