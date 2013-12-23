if (Meteor.isClient) {
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
