ServerConfig = {
  SUPAH_SECRET_PASSWORD: "trulsersjef1337",
  OWNER_EMAIL_ADDRESS: "trulsske@iterate.no",
  FROM_EMAIL_ADDRESS: "itercage@gmail.com"
}

var deleteAttendeeList = function () {
  Attendees.remove({});

  Email.send({
    to: ServerConfig.FROM_EMAIL_ADDRESS,
    from: ServerConfig.FROM_EMAIL_ADDRESS,
    subject: "[itercage] Påmeldingsliste slettet",
    text: "Påmeldingsliste slettet"
  });
}

var informOwnerOfNewAttendee = function (newAttendee) {
  var numberOfAttendees = Attendees.find({}).count();

  Email.send({
    to: ServerConfig.OWNER_EMAIL_ADDRESS,
    from: ServerConfig.FROM_EMAIL_ADDRESS,
    subject: "[itercage] " + numberOfAttendees + " påmeldte",
    text: newAttendee.name + " melte seg på"
  });

  Attendees.update(
    {_id: newAttendee._id}, {
      $set: {
          'mailsent': true
      }
    });
}

Meteor.startup(function () {

  Attendees.find({}).observe({
    added: function (attendee) {
      if (attendee.name === ServerConfig.SUPAH_SECRET_PASSWORD) {
        deleteAttendeeList();
      } else if (!attendee.mailsent) {
        informOwnerOfNewAttendee(attendee);
      }
    }
  });

});
