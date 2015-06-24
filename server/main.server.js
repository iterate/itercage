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
}

Meteor.startup(function () {

  Attendees.find({}).observe({
    added: function (attendee) {
      if (!attendee.mailsent) {
        informOwnerOfNewAttendee(attendee);
      }
    }
  });

  MailingListData.forEach(function (item) {
    if (!MailingList.findOne({email: item.email})) {
      MailingList.insert(item);
    }
  });

  Config.set('SUPAH_SECRET_PASSWORD', 'trulsersjef1337');
  Config.set('OWNER_EMAIL_ADDRESS', 'trulsske@iterate.no');
  Config.set('FROM_EMAIL_ADDRESS', 'itercage@gmail.com');

});
