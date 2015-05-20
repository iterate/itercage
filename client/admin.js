FlashMessages.configure({
  autoHide: true,
  hideDelay: 5000,
  autoScroll: true
});

Template.admin.helpers({
  sendingInvitations: function () {
    return Session.get("sendingInvitations");
  }
})

Template.admin.events({
  'click button#sendInvitations': function (event) {
    event.preventDefault && event.preventDefault();

    if (!confirm("Sikker på at du vil sende ut invitasjonseposter?")) {
      return;
    }

    var password = $('input#password').val();
    var invitationText = $('textarea#invitationText').val();

    Session.set("sendingInvitations", true);

    Meteor.call('sendInvitations', password, invitationText, function (error) {
      if (error) {
        FlashMessages.sendError("Feil passord eller noe galt med mailsending");
      } else {
        FlashMessages.sendSuccess("Invitasjoner sendt ut");
      }

      Session.set("sendingInvitations", false);
    });
  },

  'click button#getMailinglist': function (event) {
    event.preventDefault && event.preventDefault();

    var password = $('input#password').val();

    Meteor.call('getMailinglist', password, function (error, result) {
      if (error) {
        FlashMessages.sendError("Feil passord");
        return;
      }

      Session.set('mailinglist', result);
    });
  },

  'click button#clearAttendees': function (event) {
    event.preventDefault && event.preventDefault();

    if (!confirm("Sikker på at du vil slette påmeldingslisten?")) {
      return;
    }

    var password = $('input#password').val();

    Meteor.call('addAttendee', password, function (error) {
      if (error) {
        FlashMessages.sendError("Noe gikk galt");
        return;
      }

      FlashMessages.sendInfo("Påmeldingslisten er kanskje slettet. Sjekk selv");
    });

  }
});

Template.mailinglist.helpers({
  mailinglist: function () {
    return Session.get('mailinglist');
  }
});