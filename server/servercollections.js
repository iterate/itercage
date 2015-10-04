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
