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
      var measureWidth = Math.floor(width/4) - 4;
      var staveDistance = opts.staveDistance || 100;
      var measureY = 0;
      _.each(this.sheet.parts,function(part) {
         var vexFlowStaves = _.map(part.staves,function(stave) {
           var measureX = 10;
           var vexFlowMeasures = _.map(stave.measures,function(measure) {
              var vexFlowMeasure = new Vex.Flow.Stave(measureX,measureY,measureWidth);
              vexFlowMeasure.setContext(ctx).draw();
              if(measureX + measureWidth > width) {
                 measureX = 10;
                 measureY += staveDistance;
              } else {
                measureX += measureWidth;
              }

              return vexFlowMeasure;
           });
           measureY += staveDistance;
           if (stave.clef && vexFlowMeasures.length) {
             vexFlowMeasures[0].addClef(Transcribe.VexFlow.Clefs[stave.clef.sign]).setContext(ctx).draw();
           }
           return vexFlowMeasures;
         });
         if(vexFlowStaves.length > 1) {
            var connector = new Vex.Flow.StaveConnector(vexFlowStaves[0][0],vexFlowStaves.pop()[0]);
            connector.setType(Vex.Flow.StaveConnector.type.SINGLE);
            connector.setContext(ctx).draw();
         };
      });
   }
};
