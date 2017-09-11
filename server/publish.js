Meteor.publish('attendees', function () {
  return Attendees.find({
    $or: [
      {deleted: {$exists: false}},
      {deleted: false}
    ]
  });
});

Meteor.publish('nonAttendees', function (password) {
  if (isCorrectPassword(password)) {
    return NonAttendees.find({});
  }

  this.ready();
});
