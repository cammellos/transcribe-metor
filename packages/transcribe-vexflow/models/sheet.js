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
      var nStaves = 0;
      var totalStaves = _.reduce(this.sheet.parts,function(memo,part) { return memo + part.staves.length},0)

      _.each(this.sheet.parts,function(part) {
         var vexFlowStaves = _.map(part.staves,function(stave) {
           var measureX = 10;
           var measureY = staveDistance * nStaves;
           nStaves += 1;
           var vexFlowMeasures = _.map(stave.measures,function(measure,index) {
              var vexFlowMeasure = new Vex.Flow.Stave(measureX,measureY,measureWidth);
              vexFlowMeasure.setContext(ctx).draw();
              if(measureX + measureWidth > width) {
                 measureX = 10;
                 measureY += staveDistance * totalStaves;
              } else {
                measureX += measureWidth;
              }

              var vexFlowNotes = _.map(measure.notes,function(note) {
                 var duration = note.duration;
                 if (note.dot) {
                   duration = (1/(note.duration/3*2/stave.divisions*0.25)).toString() + "d";
                 } else if (note.triplet) {
                   duration = (1/(note.duration*3/2/stave.divisions*0.25)).toString();
                 } else {
                   duration = (1/(note.duration/stave.divisions*0.25)).toString();
                 }
                 var attrs = {duration: duration}
                 if (note.rest) {
                   attrs.keys = ["b/4"];
                   attrs.duration = attrs.duration + "r";
                 } else {
                   attrs.keys = [note.pitch.step + "/" + note.pitch.octave];
                 }
                 var vexFlowNote = new Vex.Flow.StaveNote(attrs);

                 if(note.dot) {
                    return vexFlowNote.addDotToAll()
                 } else {
                    return vexFlowNote;
                 }
              });

              return vexFlowMeasure;
           });
           measureY += staveDistance;
           if (stave.clef && vexFlowMeasures.length) {
             vexFlowMeasures[0].addClef(Transcribe.VexFlow.Clefs[stave.clef.sign]).setContext(ctx).draw();
           }
           return vexFlowMeasures;
         });
         if(vexFlowStaves.length > 1) {
            var firstStave = vexFlowStaves[0];
            var lastStave = vexFlowStaves.pop();
            for (var i = 0; i < firstStave.length; i += 5) {
              var connector = new Vex.Flow.StaveConnector(firstStave[i],lastStave[i]);
              connector.setType(Vex.Flow.StaveConnector.type.SINGLE);
              connector.setContext(ctx).draw();
            }
         };
      });
   }
};
