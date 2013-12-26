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
      for(var i = 0; i<this.notes.length; i++) {

         n.push(this.notes[i].toVexFlow());
      }
      return n;

   },
   toVexFlow: function(ctx,stave) {
      console.log(this);
      console.log(this.xml);
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
      voice.addTickables(this.notesToVexFlow());
      var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 500);
      voice.draw(ctx,stave);
   }
};


