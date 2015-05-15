Attendees = new Meteor.Collection("attendees");

Meteor.methods({
  addAttendee: function (name) {
    name = name.trim();

    if (name === "") {
      return;
    }

    Attendees.insert({
      name: name,
      date: new Date()
    });
  },
});
