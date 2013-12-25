Sheets = new Meteor.Collection('sheets');

Sheets.allow({
  insert: function (userId, sheet) {
    return false; 
  },
  update: function (userId, sheet, fields, modifier) {
    if (sheet.owners.indexOf(userId) === -1)
      return false; // not the owner

    var allowed = ["title", "description", "xml"];
    if (_.difference(fields, allowed).length)
      return false; 
    return true;
  },
  remove: function (userId, sheet) {
    // You can only remove parties that you created and nobody is going to.
    return sheet.owners.indexOf(userId) !== -1;
  }
});

createSheet = function (options) {
  var id = Random.id();
  Meteor.call('createSheet', _.extend({ _id: id }, options));
  return id;
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});


Meteor.methods({
  // options should include: title, description, x, y, public
  createSheet: function (options) {
    check(options, {
      title: NonEmptyString,
      description: NonEmptyString,
      _id: Match.Optional(NonEmptyString)
    });

    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    var id = options._id || Random.id();
    Sheets.insert({
      _id: id,
      owners: [this.userId],
      title: options.title,
      description: options.description,
      xml: options.xml
    });
    return id;
  },
});

