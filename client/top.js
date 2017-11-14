Template.top.rendered = function () {
  Meteor.call('allAttendees', function (err, allAttendeesEver) {
    var persons = allAttendeesEver.reduce(function (acc, cur) {
      if (!acc[cur.name]) {
        acc[cur.name] = cur;
        acc[cur.name].amount = 0;
      }

      acc[cur.name].amount += 1;

      return acc;
    }, {});

    var toplist = Object.values(persons).sort(function (a, b) {
      return b.amount - a.amount;
    });

    Session.set('toplist', toplist);
  });
}

Template.toplist.helpers({
  toplist: function () {
    return Session.get('toplist');
  },
});
