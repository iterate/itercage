Attendees = new Meteor.Collection("attendees");

Meteor.methods({
  addAttendee: function (name) {
    if (!name || name === "") {
      return;
    }

    Attendees.insert({
      name: name,
      date: new Date()
    });
  },
});
