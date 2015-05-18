ServerConfig = {
  SUPERSECRET_PASSWORD: "trulsersjef1337",
  OWNER_EMAIL_ADDRESS: "henrikgs@iterate.no",
  FROM_EMAIL_ADDRESS: "itercage@gmail.com"
}

var informOwnerOfNewAttendee = function (newAttendee) {
  var numberOfAttendees = Attendees.find({}).count();

  Email.send({
    to: ServerConfig.OWNER_EMAIL_ADDRESS,
    from: ServerConfig.FROM_EMAIL_ADDRESS,
    subject: "[itercage] " + numberOfAttendees + " påmeldte",
    text: newAttendee.name + " melte seg på.\n\nDet er nå " + numberOfAttendees + " påmeldte"
  });
}

Meteor.startup(function () {

  Attendees.find({}).observe({
    added: function (attendee) {
      if (attendee.name === ServerConfig.SUPERSECRET_PASSWORD) {
        Attendees.remove({});
      }

      informOwnerOfNewAttendee(attendee);
    }
  });

});
