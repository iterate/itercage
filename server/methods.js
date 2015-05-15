Meteor.methods({
  clearAttendees: function (password) {
    if (password === "trulsersjef") {
      Attendees.remove({});
    }
  }
});
