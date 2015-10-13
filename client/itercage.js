var FIVE_SECONDS = 5000;

Template.default.helpers({
  loading: function () {
    return !Session.get('attendeesLoaded');
  }
});

Template.list.helpers({
  attendees: function () {
    return Attendees.find({}, {sort: {date: 1}});
  },
  numberOfAttendees: function () {
    return numberOfAttendees();
  },
  mode: function () {
    var number = numberOfAttendees();
    var mode = 'danger';
    if (number > 5) {
      mode = 'warning';
    }
    if (number > 7) {
      mode = 'success';
    }

    return mode;
  },
  percent: function () {
    return numberOfAttendees() * 10;
  },
  newItem: function (date) {
    if ((new Date().getTime() - date.getTime()) < FIVE_SECONDS) {
      return 'new-item';
    }
  },
  timestamp: function (date) {
    return moment(date).fromNow();
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
        template.find('input[name=name]').value = '';
      } else {
        FlashMessages.clear();
        FlashMessages.sendError('For mange påmeldte. Kontakt truls@iterate.no dersom du vil være med.');
      }

      Session.set('addingAttendee', false);
      Meteor.setTimeout(function () {
        $('input[name=name]').focus();
      });
    });
  }
});
