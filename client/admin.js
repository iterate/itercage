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

Template.admin.events({
  'click button#sendInvitations': function (event) {
    event.preventDefault && event.preventDefault();

    if (!confirm('Sikker på at du vil sende ut invitasjonseposter?')) {
      return;
    }

    var password = $('input#password').val();
    var invitationText = $('textarea#invitationText').val();

    Session.set('sendingInvitations', true);

    Meteor.call('sendInvitations', password, invitationText, function (error) {
      if (error) {
        FlashMessages.sendError('Feil passord eller noe galt med mailsending');
      } else {
        FlashMessages.sendSuccess('Invitasjoner sendt ut');
      }

      Session.set('sendingInvitations', false);
    });
  },

  'click button#getMailinglist': function (event) {
    event.preventDefault && event.preventDefault();

    var password = $('input#password').val();

    Meteor.call('getMailinglist', password, function (error, result) {
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

    var password = $('input#password').val();

    Meteor.call('clearAttedees', password, function (error) {
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

    var password = $('input#password').val();
    var name = $('input#newMailingListPersonName').val();
    var email = $('input#newMailingListPersonEmail').val();

    if (!name || !email) {
      FlashMessages.sendError('Mangler navn eller epost');
      return;
    }

    Meteor.call('addToMailinglist', password, name, email, function (error) {
      if (error) {
        FlashMessages.sendError('Feil passord');
        return;
      }

      $('input#newMailingListPersonName').val('');
      $('input#newMailingListPersonEmail').val('');

      Meteor.call('getMailinglist', password, function (error, result) {
        if (!error) {
          Session.set('mailinglist', result);
        }
      });
    });
  },

  'click a.remove-person': function (event) {
    event.preventDefault && event.preventDefault();

    if (!confirm('Sikker på at du vil slette ' + this.name + ' fra mailinglisten?')) {
      return;
    }

    var password = $('input#password').val();

    Meteor.call('removeFromMailinglist', password, this._id, function (error) {
      if (error) {
        FlashMessages.sendError('Feil passord');
        return;
      }

      Meteor.call('getMailinglist', password, function (error, result) {
        if (!error) {
          Session.set('mailinglist', result);
        }
      });
    });
  }
});

Template.mailinglist.helpers({
  mailinglist: function () {
    return Session.get('mailinglist');
  }
});
