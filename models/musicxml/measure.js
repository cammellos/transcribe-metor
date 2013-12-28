MusicXMLMeasure = function(xml,attributes) {
   this.xml = xml;
   this.number = this.xml.getAttribute("number");
   //if (xml.getElementsByTagName('attributes').length) {
   //  this.attributes = new MusicXMLMeasureAttributes(xml.getElementsByTagName('attributes')[0]);
   //} else {
     this.attributes = attributes;
   //}
   this.notes = [];
   this.parseNotes();
};

MusicXMLMeasure.prototype = {
   parseNotes: function() {
     var notesXML = this.xml.getElementsByTagName('note');
     for(var i = 0; i< notesXML.length; i++) {
        this.notes.push(new MusicXMLNote(notesXML[i],this.attributes));
     }
   },
   xmlToVexFlowClef: function(clef) {

   },
   notesToVexFlow: function() {
      var n = [];
      var beams = [];
      var slurs = [];
      for(var i = 0; i<this.notes.length; i++) {
         var vexNote = this.notes[i].toVexFlow();
         if( this.notes[i].beam ) {
            if (!beams[this.notes[i].beam.number]) {
               beams[this.notes[i].beam.number] = []
            }
            beams[this.notes[i].beam.number].push(vexNote);
         }
         if( this.notes[i].slur ) {
            if (!slurs[this.notes[i].slur.number]) {
               slurs[this.notes[i].slur.number] = []
            }
            slurs[this.notes[i].slur.number].push(vexNote);
         }
         n.push(vexNote);
      }
      return {notes: n, slurs: slurs, beams: beams};

   },
   toVexFlow: function(ctx,stave) {
      if (this.attributes && this.attributes.clef) {
         if(this.attributes.clef.line == "2" && this.attributes.clef.sign == "G") {
            //stave.addClef("treble");
         }
      }
      var voice = new Vex.Flow.Voice({
        num_beats: this.attributes && this.attributes.time && this.attributes.time.beats ? this.attributes.time.beats : "4",
        beat_value: this.attributes && this.attributes.time && this.attributes.time["beat-type"] ? this.attributes.time["beat-type"] : "4",
        resolution: Vex.Flow.RESOLUTION
      });
      var n = this.notesToVexFlow();
      var beams = [];
      var slurs = [];

      for (var i = 0; i < n.beams.length; i++) {
         if (n.beams[i]) {
            beams.push(new Vex.Flow.Beam(n.beams[i]));
         }
      }
      for (var i = 0; i < n.slurs.length; i++) {
         if (n.slurs[i]) {
            slurs.push(new Vex.Flow.StaveTie({
               first_note: n.slurs[i][0],
               last_note: n.slurs[i][1],
               first_indices: [0],
               last_indices: [0]}))
         }
      }



      voice.addTickables(n.notes);
      var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], stave.width - 10);
      voice.draw(ctx,stave);

      for (var i = 0; i < beams.length; i++ ) {
        beams[i].setContext(ctx).draw();
      }
      for (var i = 0; i < slurs.length; i++ ) {
        slurs[i].setContext(ctx).draw();
      }


   }
};


