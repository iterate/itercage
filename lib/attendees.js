Attendees = new Meteor.Collection("attendees");

Meteor.methods({
  addAttendee: function (name) {
    Attendees.insert({
      name: name,
      date: new Date()
    });
  },
});
