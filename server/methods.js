var guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var inviteToCageball = function (person, invitationText) {
  Email.send({
    to: person.email,
    from: Config.get('FROM_EMAIL_ADDRESS'),
    subject: "[itercage] Påmelding til Cageball",
    text: invitationText
  });
}

var verifyPassword = function (password) {
  if (password !== Config.get('SUPAH_SECRET_PASSWORD')) {
    throw new Error("Wrong password");
  }
}

Meteor.methods({
  sendInvitations: function (password, invitationText) {
    verifyPassword(password);

    this.unblock();

    MailingList.find({}).fetch().forEach(function (person) {
      inviteToCageball(person, invitationText);
    });
  },

  getMailinglist: function (password) {
    verifyPassword(password);

    return MailingList.find({}).fetch();
  },

  addToMailinglist: function (password, name, email) {
    verifyPassword(password);

    MailingList.insert({
      name: name,
      email: email
    });
  },

  removeFromMailinglist: function (password, personId) {
    verifyPassword(password);

    MailingList.remove({
      _id: personId
    });
  },

  removeAttendee: function (password, attendeeId) {
    verifyPassword(password);

    Attendees.remove({_id: attendeeId});
  },

  clearAttedees: function (password) {
    verifyPassword(password);

    Attendees.remove({});

    Email.send({
      to: Config.get('FROM_EMAIL_ADDRESS'),
      from: Config.get('FROM_EMAIL_ADDRESS'),
      subject: "[itercage] Påmeldingsliste slettet",
      text: "Påmeldingsliste slettet"
    });
  },
});
