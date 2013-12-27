MusicXMLNote = function(xml,attributes) {
   this.xml = xml;
   this.attributes = attributes;
   this.duration = parseInt(this.xml.getElementsByTagName("duration")[0].textContent);
   this.rest = this.isRest();
   this.voice = this.xml.getElementsByTagName("voice")[0].textContent;
   if(this.xml.getElementsByTagName("dot").length) {
     this.dot = true;
     console.log("dotted");
     //this.duration = this.duration / 3 * 2;
   }
   if(this.xml.getElementsByTagName("type").length) {
     this.type = this.xml.getElementsByTagName("type")[0].textContent;
   }
   if(!this.rest) {
     this.parsePitch();
   }
};

MusicXMLNote.prototype = {
   isRest: function() {
     return this.xml.getElementsByTagName("rest").length != 0;
   },
   parsePitch: function() {
      var p = this.xml.getElementsByTagName("pitch")[0];
      var step = p.getElementsByTagName("step")[0].textContent;
      var octave = p.getElementsByTagName("octave")[0].textContent;
      this.pitch = {step: step, octave: octave};
   },
   toVexFlow: function() {
      var duration = this.duration;
      if (this.dot) {
        duration = (1/(this.duration/3*2/this.attributes.divisions*0.25)).toString() + "d";
      } else {
        duration = (1/(this.duration/this.attributes.divisions*0.25)).toString();
      }
      var attrs = {duration: duration}
      if (this.rest) {
        attrs.keys = ["b/4"];
        attrs.duration = attrs.duration + "r";
      } else {
        attrs.keys = [this.pitch.step + "/" + this.pitch.octave];
      }
  
      var note  = new Vex.Flow.StaveNote(attrs);
      if(this.dot) {
         note = note.addDotToAll()
      }


     return note;
   }
};


