FlashMessages.configure({
  autoHide: true,
  hideDelay: 5000,
  autoScroll: true
});

Template.admin.helpers({
  sendingInvitations: function () {
    return Session.get('sendingInvitations');
  },
  storedPassword: function () {
    return Session.get('storedPassword') || '';
  }
});

function sendInvitations(meteorMethod) {
  if (!confirm('Sikker på at du vil sende ut invitasjonseposter?')) {
    return;
  }

  var invitationText = $('textarea#invitationText').val();

  Session.set('sendingInvitations', true);

  Meteor.call(meteorMethod, Session.get('storedPassword'), invitationText, function (error) {
    if (error) {
      FlashMessages.sendError('Feil passord eller noe galt med mailsending');
    } else {
      FlashMessages.sendSuccess('Invitasjoner sendt ut');
    }

    Session.set('sendingInvitations', false);
  });
}

Template.admin.events({
  'click button#sendInvitations': function (event) {
    event.preventDefault && event.preventDefault();

    sendInvitations('sendInvitations');
  },

  'click button#sendInvitationsToExternals': function (event) {
    event.preventDefault && event.preventDefault();

    sendInvitations('sendInvitationsToExternals');
  },

  'click button#getMailinglist': function (event) {
    event.preventDefault && event.preventDefault();

    Meteor.call('getMailinglist', Session.get('storedPassword'), function (error, result) {
      if (error) {
        FlashMessages.sendError('Feil passord');
        return;
      }

      Session.set('mailinglist', result);
    });
  },

  'click button#clearAttendees': function (event) {
    event.preventDefault && event.preventDefault();

    if (!confirm('Sikker på at du vil slette påmeldingslisten?')) {
      return;
    }

    Meteor.call('clearAttedees', Session.get('storedPassword'), function (error) {
      if (error) {
        FlashMessages.sendError('Feil passord');
        return;
      }
    });
  },

  'blur #password': function (event) {
      Session.setPersistent('storedPassword', event.target.value);
    }
});

Template.mailinglist.events({
  'submit form#newMailingListPerson': function (event) {
    event.preventDefault && event.preventDefault();

    var name = $('input#newMailingListPersonName').val();
    var email = $('input#newMailingListPersonEmail').val();
    var external = $('input#newMailingListPersonExternal')[0].checked;

    if (!name || !email) {
      FlashMessages.sendError('Mangler navn eller epost');
      return;
    }

    Meteor.call('addToMailinglist', Session.get('storedPassword'), name, email, external, function (error, result) {
      if (error) {
        FlashMessages.sendError('Feil passord');
        return;
      }

      $('input#newMailingListPersonName').val('');
      $('input#newMailingListPersonEmail').val('');
      $('input#newMailingListPersonExternal').attr('checked', false);

      Session.set('mailinglist', result);
    });
  },

  'click a.remove-person': function (event) {
    event.preventDefault && event.preventDefault();

    if (!confirm('Sikker på at du vil slette ' + this.name + ' fra mailinglisten?')) {
      return;
    }

    Meteor.call('removeFromMailinglist', Session.get('storedPassword'), this._id, function (error, result) {
      if (error) {
        FlashMessages.sendError('Feil passord');
        return;
      }

      Session.set('mailinglist', result);
    });
  }
});

Template.list.events({
  'click a.remove-attendee': function (event, template) {
    event.preventDefault && event.preventDefault();

    Meteor.call('removeAttendee', Session.get('storedPassword'), this._id, function (error) {
      if (error) {
        FlashMessages.sendError('Feil passord');
      }
    });
  }
});

Template.mailinglist.helpers({
  mailinglist: function () {
    return Session.get('mailinglist');
  }
});
