var guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var inviteToCageball = function (person, invitationText) {
  Email.send({
    to: person.email,
    from: ServerConfig.FROM_EMAIL_ADDRESS,
    subject: "[itercage] Påmelding til Cageball",
    text: invitationText
  });
}

Meteor.methods({
  sendInvitations: function (password, invitationText) {
    if (password !== ServerConfig.SUPAH_SECRET_PASSWORD) {
      throw new Error("Wrong password");
    }

    this.unblock();

    MailingList.forEach(function (person) {
      inviteToCageball(person, invitationText);
    });
  },

  getMailinglist: function (password) {
    if (password !== ServerConfig.SUPAH_SECRET_PASSWORD) {
      throw new Error("Wrong password");
    }

    return MailingList;
  }
});
