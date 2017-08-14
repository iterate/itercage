var informOwnerOfNewAttendee = function (newAttendee) {
  var numberOfAttendees = Attendees.find({}).count();

  var date = moment().format('DD-MM-YYYY');
  var text = newAttendee.name + ' (' + numberOfAttendees + ' påmeldte)';

  Email.send({
    to: Config.get('OWNER_EMAIL_ADDRESS'),
    from: Config.get('FROM_EMAIL_ADDRESS'),
    subject: '[itercage] Ny påmelding (' + date + ')',
    text: text
  });
};

Meteor.startup(function () {
  console.log('Production mode: ' + Meteor.isProduction);

  SSR.compileTemplate('inviteTemplate', Assets.getText('inviteTemplate.html'));
  Template.inviteTemplate.helpers({
    transformNewline: function(text) {
      return new Spacebars.SafeString(text.replace(/(\r\n|\n|\r)/g, '<br>'));
    }
  });

  Attendees.find({}).observe({
    added: function (attendee) {
      if (!attendee.mailsent) {
        Attendees.update({_id: attendee._id}, {$set: {'mailsent': true}});

        try {
          informOwnerOfNewAttendee(attendee);
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  addPeepz();

});

function addPeepz() {
  var peepz = [
  {
      "_id": "n5bpWCErqEkcJZMji",
      "name": "Truls Skeie",
      "email": "trulsske@iterate.no"
  }, {
      "_id": "SBc5hZgQunhEmiCQ5",
      "name": "Susanne Moseby",
      "email": "susannmo@iterate.no"
  }, {
      "_id": "arXgZa8NnnrdctWxu",
      "name": "Stig Bergestad",
      "email": "stigberg@iterate.no"
  }, {
      "_id": "i9pWLseosJHvBKH28",
      "name": "Sigve Barstad",
      "email": "sigve@iterate.no"
  }, {
      "_id": "p3qit5c3K86K4ffaW",
      "name": "Rune Larsen",
      "email": "rune.larsen@iterate.no"
  }, {
      "_id": "gNKcMf9JFgaPNpHhB",
      "name": "Morten Slaatten Berg",
      "email": "morten@iterate.no"
  }, {
      "_id": "R9YxobQk9zASCSu3y",
      "name": "Morten Weel Johnsen",
      "email": "morten.weel.johnsen@iterate.no"
  }, {
      "_id": "ymwm2wFF8e5bZctsf",
      "name": "Rana Singh",
      "email": "singh@iterate.no"
  }, {
      "_id": "Q2oW5yhf7BebmLNaX",
      "name": "Mari Wien",
      "email": "wien@iterate.no"
  }, {
      "_id": "ANMY6N7svLoNEZBke",
      "name": "Magnus Lien",
      "email": "supermgns@iterate.no"
  }, {
      "_id": "5baTtc9dtreb2kfMn",
      "name": "Magnús Dæhlen",
      "email": "sungamd@iterate.no"
  }, {
      "_id": "TAKbTdTHoKjoKTGDr",
      "name": "Kim Ophus Leskovsky",
      "email": "kim@iterate.no"
  }, {
      "_id": "CGP5ZChhccqz6euvt",
      "name": "Jørgen Aaberg",
      "email": "jorgeaab@iterate.no"
  }, {
      "_id": "FPqjXLcJiicWCgawy",
      "name": "Henrik Glasø Skifjeld",
      "email": "henrik@iterate.no"
  }, {
      "_id": "Ki5Qxu3CHPAcBnZND",
      "name": "Brynjar Rongved",
      "email": "brynjar@iterate.no"
  }, {
      "_id": "ZK3ZTngfcfT9zQcGN",
      "name": "Arne",
      "email": "arne@iterate.no"
  }, {
      "_id": "tzZTroXDy73gonvuZ",
      "name": "Kjetil",
      "email": "kjsletten@gmail.com"
  }, {
      "_id": "tnkHLRpBHAz6fLJ7K",
      "name": "Karine",
      "email": "karine@iterate.no"
  }, {
      "_id": "cWN7ssiJjuKB3dojM",
      "name": "Sindre",
      "email": "sindre@iterate.no"
  }, {
      "_id": "JS8w5swXLX6TetBHH",
      "name": "Stein Kvarud",
      "email": "stein.kvarud@iterate.no"
  }, {
      "_id": "MvvqDS3PvwmLaYtSL",
      "name": "Simen Fure Jørgensen",
      "email": "simenfur@gmail.com",
      "external": true
  }, {
      "_id": "MGCDGsZ4DEaiswfWq",
      "name": "Patrick Skevik",
      "email": "patrick@iterate.no"
  }, {
      "_id": "wm6GcCpzD5uJCDBPD",
      "name": "Fredrik Pettersen",
      "email": "fredrik@iterate.no"
  }, {
      "_id": "EztA438RmG4BQQeyA",
      "name": "Julia",
      "email": "Julia.baulin@iterate.no"
  }, {
      "_id": "oYsS4GsqSNebcdQfc",
      "name": "Bendik",
      "email": "bendik@iterate.no"
  }, {
      "_id": "KneJA5L3NLHTTWXnv",
      "name": "Andreas",
      "email": "Andreas@iterate.no"
  }, {
      "_id": "x5gYSP8DZAWyvvccj",
      "name": "Pål",
      "email": "ruudud@gmail.com",
      "external": true
  }, {
      "_id": "CLz8R8beJ6KLNX4qg",
      "name": "Vebjørn",
      "email": "vebjorn.gronhaug@gmail.com",
      "external": true
  }, {
      "_id": "bNttFNGHogi4TkMtS",
      "name": "Jonas Blix",
      "email": "jonasblix91@gmail.com",
      "external": true
  }, {
      "_id": "2jZcq8kHqyXmReiuB",
      "name": "Torkil Vederhus",
      "email": "torkilv@gmail.com",
      "external": true
  }, {
      "_id": "unhYyXc3TFEACcWYm",
      "name": "Daniel Rees",
      "email": "daniel1982rees@gmail.com",
      "external": true
  }, {
      "_id": "SWo78fm8nuLj2iD9H",
      "name": "Ida",
      "email": "ida@iterate.no",
      "external": false
  }, {
      "_id": "egyZkbMnPkHKEa3eN",
      "name": "Andreas",
      "email": "andreas.pedersen@finn.no",
      "external": true
  }, {
      "_id": "uboSYqZA556mf98QS",
      "name": "Stian",
      "email": "stianlp@gmail.com",
      "external": true
  }, {
      "_id": "L6EYtrZdTCgBQDFmJ",
      "name": "Morten",
      "email": "Morten.andreassen@iterate.no",
      "external": false
  }, {
      "_id": "NComLRbwXigAeM3n3",
      "name": "cathrine",
      "email": "cathrine@tinderbox.no",
      "external": true
  }, {
      "_id": "XjZTuMCKSW24rXBT7",
      "name": "Tor-Erik",
      "email": "torerik@iterate.no",
      "external": false
  }, {
      "_id": "AmdctwEceg8BrfM6r",
      "name": "Andrew Paul Swift",
      "email": "andrew@iterate.no"
  }, {
      "_id": "QmXGiN3vFxsBZ9ZoJ",
      "name": "Mathias",
      "email": "mathias.froyhaug@iterate.no",
      "external": false
  }, {
      "_id": "Eisi5yPmsyiDd27af",
      "name": "Thomas",
      "email": "thomas.leira@iterate.no",
      "external": false
  }, {
      "_id": "fXg7GDoyhHTxRnN5X",
      "name": "Tom J. Bang",
      "email": "bang@iterate.no"
  }, {
      "_id": "6CngP4Aw6k6x9qL7F",
      "name": "Pål Ruud",
      "email": "palru@iterate.no"
  }, {
      "_id": "H5RksHMKaNiMEhWMu",
      "name": "Simen Fure Jørgensen",
      "email": "jorgensen@iterate.no"
  }, {
      "_id": "XKKChgfBSHh2BCHs7",
      "name": "Iselin Kornli",
      "email": "iselin@iterate.no"
  }];

  peepz.forEach(function (peep) {
    MailingList.upsert({
      email: peep.email
    }, {
      name: peep.name,
      email: peep.email,
      external: peep.external
    });
  }, function (error) {
    if (error) {
      console.error(error);
    }
  });

}
