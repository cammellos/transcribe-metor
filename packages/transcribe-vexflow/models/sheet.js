Transcribe.VexFlow.Clefs = {
   "G": "treble",
   "F": "bass",
};
Transcribe.VexFlow.Sheet = function(sheet) {
   this.sheet = sheet;
};

Transcribe.VexFlow.Sheet.prototype = {
   render: function(canvas, opts) {
      opts = typeof opts !== 'undefined' ? opts : {};
      var renderer = new Vex.Flow.Renderer(canvas,Vex.Flow.Renderer.Backends.CANVAS);
      var width = opts.width || canvas.width;
      var height = opts.height || canvas.height;
      var ctx = renderer.getContext();
      var staveWidth = Math.floor(width/4) - 4;
      var staveDistance = opts.staveDistance || 100;
      var staveY = 0;
      var staveX = 10;
      _.each(this.sheet.parts,function(part) {
         var staves = _.map(part.staves,function(stave) {
           var vexFlowStave = new Vex.Flow.Stave(staveX,staveY,staveWidth);
           vexFlowStave.setContext(ctx).draw();
           if (stave.clef) {
              vexFlowStave.addClef(Transcribe.VexFlow.Clefs[stave.clef.sign]).setContext(ctx).draw();
           }
           _.each(part.measures,function(measure) {
              if(staveX + staveWidth > width) {
                 staveX = 10;
                 staveY += staveDistance;
              }
           });
           staveY += staveDistance;
           return vexFlowStave;
         });
         if(staves.length > 1) {
            var connector = new Vex.Flow.StaveConnector(staves[0],staves.pop());
            connector.setType(Vex.Flow.StaveConnector.type.SINGLE);
            connector.setContext(ctx).draw();
         };
      });
   }
};
