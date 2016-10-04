Attendees = new Meteor.Collection('attendees');

MAX_NUMBER_OF_ATTENDEES = 10;

numberOfAttendees = function() {
  return Attendees.find({}).count();
};

Meteor.methods({
  addAttendee: function (name, external) {
    name = name.trim();

    if (name === '') {
      return;
    }

    if (numberOfAttendees() >= MAX_NUMBER_OF_ATTENDEES) {
      throw new Meteor.Error('Too many attendees');
    }

    Attendees.insert({
      name: name,
      external: external,
      date: new Date()
    });
  }
});
