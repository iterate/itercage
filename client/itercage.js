Template.list.helpers({
  attendees: function () {
    return Attendees.find({}, {sort: {date: 1}});
  },
  numberOfAttendees: function () {
    return Attendees.find({}).count();
  },
  showRemoveAttendeeButtons: function () {
    return Session.get('showRemoveAttendeeButtons');
  }
});

Template.newAttendee.helpers({
  addingAttendee: function () {
    return Session.get('addingAttendee');
  }
});

Template.newAttendee.events({
  'submit form[name=newAttendee]': function (event, template) {
    event.preventDefault && event.preventDefault();

    Session.set('addingAttendee', true);

    var name = template.find('input[name=name]').value;

    Meteor.call('addAttendee', name, function (error) {
      if (!error) {
        template.find('input[name=name]').value = "";
      }

      Session.set('addingAttendee', false);
    });
  }
});

Template.list.events({
  'click a.remove-attendee': function (event, template) {
    event.preventDefault && event.preventDefault();

    var password = $('input#password').val();

    Meteor.call('removeAttendee', password, this._id, function (error) {
      if (error) {
        FlashMessages.sendError("Feil passord");
      }
    });
  }
});
