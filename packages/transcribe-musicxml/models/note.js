
Transcribe.MusicXML.Note = function(xml,attributes) {
};

Transcribe.MusicXML.Note.parsePitch = function(xml) {
      var p = xml.getElementsByTagName("pitch")[0];
      var step = p.getElementsByTagName("step")[0].textContent;
      var octave = p.getElementsByTagName("octave")[0].textContent;
      return {step: step, octave: octave};
}

Transcribe.MusicXML.Note.read = function(xml,stave) {
   var note = new Transcribe.Models.Note();
   note.stave = stave;
   note.duration = parseInt(xml.getElementsByTagName("duration")[0].textContent);
   note.rest = xml.getElementsByTagName("rest").length != 0;
   note.voice = xml.getElementsByTagName("voice")[0].textContent;
   note.staff = Transcribe.Helpers.extractTextFromXML("staff",xml) ? parseInt(Transcribe.Helpers.extractTextFromXML("staff",xml)) : 1;
   note.triplet = xml.getElementsByTagName("time-modification").length ? true : false;
   var beam = xml.getElementsByTagName("beam");
   var slur = xml.getElementsByTagName("slur");

   if(slur.length) {
      note.slur = {number: slur[0].getAttribute("number"), type: slur[0].textContent, placement: slur[0].getAttribute("placement")}
   }
   if(beam.length) {
      note.beam = {number: beam[0].getAttribute("number"), type: beam[0].textContent}
   }
   if(xml.getElementsByTagName("dot").length) {
     note.dot = true;
     //this.duration = this.duration / 3 * 2;
   }
   if(xml.getElementsByTagName("type").length) {
     note.type = xml.getElementsByTagName("type")[0].textContent;
   }
   if(!note.rest) {
     note.pitch = Transcribe.MusicXML.Note.parsePitch(xml);
   }
   return note;
};


Transcribe.MusicXML.Note.prototype = {
   isRest: function() {
     return this.xml.getElementsByTagName("rest").length != 0;
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


