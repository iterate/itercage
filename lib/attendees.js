Attendees = new Meteor.Collection("attendees");

numberOfAttendees = function() {
  return Attendees.find({}).count();
};

Meteor.methods({
  addAttendee: function (name) {
    name = name.trim();

    if (name === "") {
      return;
    }

    if (numberOfAttendees() >= 10) {
      throw new Error("Too many attendees");
    }

    Attendees.insert({
      name: name,
      date: new Date()
    });
  },
});
