if (Meteor.isClient) {
  Template.mainContent.showCreateDialog = function () {
    return Session.get("showCreateDialog");
  };
  Template.createDialog.error = function () {
    return Session.get("createError");
  };
  Template.createDialog.events({
     'click .cancel': function(event,template) {
        Session.set("showCreateDialog", false);
     },
 
     'click .save': function(event,template) {
        var title = template.find(".title").value;
        var description = template.find(".description").value;
        if (title.length && description.length) {
          var id = Transcribe.Collections.createSheet({
            title: title,
            description: description,
          });
          Session.set("showCreateDialog", false);
        } else {
           Session.set("createError",
                  "It needs a title and a description, or why bother?");
        }
     }
  });

  Template.navigation.sheets = function() {
     return Transcribe.Collections.Sheets.find();
  };

  Template.navigation.events({
     'click .create-new-sheet': function() {
        Session.set("createError", null);
        Session.set("showCreateDialog", true);
     }
  });
  Template.canvas.events({
     'click input': function() {
        $.get("/xmls/sample.xml", function(xml){
           var sheet = Transcribe.MusicXML.Sheet.fromXML(xml);
           var vexFlowSheet = new Transcribe.VexFlow.Sheet(sheet);
           vexFlowSheet.render($("#main-canvas")[0]);

        });
        }
     });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
