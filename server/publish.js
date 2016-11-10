Meteor.publish('attendees', function () {
  return Attendees.find({});
});

Meteor.publish('nonAttendees', function (password) {
  if (isCorrectPassword(password)) {
    return NonAttendees.find({});
  }

  this.ready();
});
