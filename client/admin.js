FlashMessages.configure({
    autoHide: true,
    hideDelay: 5000,
    autoScroll: true
  });

Template.admin.events({
  'click button#sendInvitations': function (event) {
    event.preventDefault && event.preventDefault();

    var password = $('input#password').val();
    var invitationText = $('textarea#invitationText').val();

    Meteor.call('sendInvitations', password, invitationText, function (error) {
      if (error) {
        FlashMessages.sendError("Feil passord eller noe galt med mailsending");
        return;
      }

      FlashMessages.sendSuccess("Invitasjoner sendt ut");
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
  }
});

Template.mailinglist.helpers({
  mailinglist: function () {
    return Session.get('mailinglist');
  }
});
