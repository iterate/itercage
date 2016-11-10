isCorrectPassword = function (password) {
  return password === Config.get('SUPAH_SECRET_PASSWORD');
}

var guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

var verifyPassword = function (password) {
  if (!isCorrectPassword(password)) {
    throw new Meteor.Error('Wrong password');
  }
}

var inviteToCageball = function (person, invitationText) {
  var hash = guid();
  var name = person.name.split(' ')[0];
  var date = moment().format('DD-MM-YYYY');

  var html = SSR.render('inviteTemplate', {
    name: name,
    invitationText: invitationText,
    hash: hash
  });

  Email.send({
    to: person.email,
    from: Config.get('FROM_EMAIL_ADDRESS'),
    subject: '[itercage] Påmelding (' + date + ')',
    html: html
  });

  Invites.insert({
    name: name,
    fullName: person.name,
    hash: hash,
    date: new Date(),
    external: person.external
  });
}

Meteor.methods({
  sendInvitations: function (password, invitationText) {
    verifyPassword(password);

    this.unblock();

    MailingList.find({}).fetch().forEach(function (person) {
      if (!person.external) {
        inviteToCageball(person, invitationText);
      }
    });
  },

  sendInvitationsToExternals: function (password, invitationText) {
    verifyPassword(password);

    this.unblock();

    MailingList.find({}).fetch().forEach(function (person) {
      if (person.external) {
        inviteToCageball(person, invitationText);
      }
    });
  },

  getMailinglist: function (password) {
    verifyPassword(password);

    return MailingList.find({}).fetch();
  },

  addToMailinglist: function (password, name, email, external) {
    verifyPassword(password);

    MailingList.insert({
      name: name,
      email: email,
      external: !!external
    });

    return MailingList.find({}).fetch();
  },

  removeFromMailinglist: function (password, personId) {
    verifyPassword(password);

    MailingList.remove({
      _id: personId
    });

    return MailingList.find({}).fetch();
  },

  addAttendeeByHash: function (hash) {
    var invite = Invites.findOne({hash: hash});

    if (invite) {
      if (invite.external) {
        Meteor.call('addAttendee', invite.fullName, true);
      } else {
        Meteor.call('addAttendee', invite.name, false);
      }

      Invites.remove({hash: hash});
    }
  },

  addNonAttendeeByHash: function (hash) {
    var invite = Invites.findOne({hash: hash});

    if (invite) {
      var name = (invite.external && invite.fullName || invite.name || '').trim();

      if (name === '') {
        return;
      }

      NonAttendees.insert({
        name: name,
        external: invite.external,
        date: new Date()
      });

      Invites.remove({hash: hash});
    }
  },

  removeAttendee: function (password, attendeeId) {
    verifyPassword(password);

    Attendees.remove({_id: attendeeId});
  },

  clearAttedees: function (password) {
    verifyPassword(password);

    Attendees.remove({});
    NonAttendees.remove({});
    Invites.remove({});

    Email.send({
      to: Config.get('FROM_EMAIL_ADDRESS'),
      from: Config.get('FROM_EMAIL_ADDRESS'),
      subject: '[itercage] Påmeldingsliste slettet',
      text: 'Påmeldingsliste slettet'
    });
  },
});
