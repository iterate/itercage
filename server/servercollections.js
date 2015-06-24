MailingList = new Meteor.Collection('mailinglist');

ServerConfig = new Meteor.Collection('config');


Config = {
  get: function (key) {
    var config = ServerConfig.findOne({key: key});
    if (!config) {
      throw new Error('No such config: ' + key);
    }
    return config.value;
  },

  set: function (key, value) {
    ServerConfig.upsert(
      {key: key},
      {
        key: key,
        value: value
      });
  }
};


MailingListData = [
  {
    name: "Truls Skeie",
    email: "trulsske@iterate.no"
  }, {
    name: "Tom J. Bang",
    email: "bang@iterate.no"
  }, {
    name: "Susanne Moseby",
    email: "susannmo@iterate.no"
  }, {
    name: "Stig Bergestad",
    email: "stigberg@iterate.no"
  }, {
    name: "Sigve Barstad",
    email: "sigve@iterate.no"
  }, {
    name: "Rune Larsen",
    email: "rune.larsen@iterate.no"
  }, {
    name: "Morten Slaatten Berg",
    email: "morten@iterate.no"
  }, {
    name: "Morten Weel Johnsen",
    email: "morten.weel.johnsen@iterate.no"
  }, {
    name: "Rana Singh",
    email: "singh@iterate.no"
  }, {
    name: "Pål Ruud",
    email: "palru@iterate.no"
  }, {
    name: "Mari Wien",
    email: "wien@iterate.no"
  }, {
    name: "Magnus Lien",
    email: "supermgns@iterate.no"
  }, {
    name: "Magnús Dæhlen",
    email: "sungamd@iterate.no"
  }, {
    name: "Kim Ophus Leskovsky",
    email: "kim@iterate.no"
  }, {
    name: "Jørgen Aaberg",
    email: "jorgeaab@iterate.no"
  }, {
    name: "Simen Fure Jørgensen",
    email: "jorgensen@iterate.no"
  }, {
    name: "Iselin Kornli",
    email: "iselin@iterate.no"
  }, {
    name: "Henrik Glasø Skifjeld",
    email: "henrik@iterate.no"
  }, {
    name: "Brynjar Rongved",
    email: "brynjar@iterate.no"
  }, {
    name: "Andrew Paul Swift",
    email: "andrew@iterate.no"
  }
];
