MusicXMLNote = function(xml,attributes) {
   this.xml = xml;
   console.log(this.xml);
   this.attributes = attributes;
   this.duration = parseInt(this.xml.getElementsByTagName("duration")[0].textContent);
   this.rest = this.isRest();
   this.voice = this.xml.getElementsByTagName("voice")[0].textContent;
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
      var attrs = {duration: (1/(this.duration/this.attributes.divisions*0.25)).toString()}
      if (this.rest) {
        attrs.keys = ["b/4"];
        attrs.duration = attrs.duration + "r";
      } else {
        attrs.keys = [this.pitch.step + "/" + this.pitch.octave];
      }
      return new Vex.Flow.StaveNote(attrs);
   }
};


