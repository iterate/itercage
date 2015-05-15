Meteor.publish('attendees', function () {
  return Attendees.find({});
});
