Template.list.helpers({
  attendees: function () {
    return Attendees.find({}, {sort: {date: 1}});
  },
  numberOfAttendees: function () {
    return Attendees.find({}).count();
  }
});

Template.list.events({
  'click a#clearAttendees': function (event) {
    event.preventDefault && event.preventDefault();

    var password = $('input[name=name]').val();

    Meteor.call('clearAttendees', password, function () {
      $('input[name=name]').val("");
    });
  }
});

Template.newAttendee.events({
  'submit form[name=newAttendee]': function (event, template) {
    event.preventDefault && event.preventDefault();

    var name = template.find('input[name=name]').value;

    Meteor.call('addAttendee', name, function (error) {
      if (!error) {
        template.find('input[name=name]').value = "";
      }
    });
  }
});
