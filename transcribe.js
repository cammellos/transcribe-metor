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
          var id = createSheet({
            title: title,
            description: description,
          });
          console.log(id);
          Session.set("showCreateDialog", false);
        } else {
           Session.set("createError",
                  "It needs a title and a description, or why bother?");
        }
     }
  });

  Template.navigation.sheets = function() {
     return Sheets.find();
  };

  Template.navigation.events({
     'click .create-new-sheet': function() {
        Session.set("createError", null);
        Session.set("showCreateDialog", true);
     }
  });
  Template.canvas.events({
     'click input': function() {
        $.get("/xmls/sample.xml", function(response){
           console.log(response);
           var canvas = $("#main-canvas")[0];
           var renderer = new Vex.Flow.Renderer(canvas,
                  Vex.Flow.Renderer.Backends.CANVAS);

           var ctx = renderer.getContext();
           var stave = new Vex.Flow.Stave(10, 0, 500);
           stave.addClef("treble").setContext(ctx).draw();
                           
        });
        }
     });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
