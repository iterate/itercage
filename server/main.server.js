var informOwnerOfNewAttendee = function (newAttendee) {
  var numberOfAttendees = Attendees.find({}).count();

  var date = moment().format('DD-MM-YYYY');
  var text = newAttendee.name + " (" + numberOfAttendees + " påmeldte)";

  Email.send({
    to: Config.get('OWNER_EMAIL_ADDRESS'),
    from: Config.get('FROM_EMAIL_ADDRESS'),
    subject: "[itercage] Ny påmelding (" + date + ")",
    text: text
  });

  Attendees.update(
    {_id: newAttendee._id}, {
      $set: {
          'mailsent': true
      }
    });
};

Meteor.startup(function () {

  SSR.compileTemplate('inviteTemplate', Assets.getText('inviteTemplate.html'));
  Template.inviteTemplate.helpers({
      transformNewline: function(text) {
          return new Spacebars.SafeString(text.replace(/(\r\n|\n|\r)/g, "<br>"));
      }
  });

  Attendees.find({}).observe({
    added: function (attendee) {
      if (!attendee.mailsent) {
        try {
          informOwnerOfNewAttendee(attendee);
        } catch (e) { /* Ignore not sent */ }
      }
    }
  });

});
