extract_text = function(attr,xml) {

  var tmp = xml.getElementsByTagName(attr);
  if (tmp.length) {
    return tmp[0].textContent;
  }
};

MusicXMLPartList = function(xml) {
   this.xml = xml;
   this.id = xml.getAttribute('id');
   this.partName = xml.getElementsByTagName("part-name")[0].childNodes[0].textContent;
   // TODO: score-instrument, midi-instrument
};

MusicXMLPart = function(xml) {
   this.xml = xml;
   this.id = xml.getAttribute('id');
   this.measures = [];
   // parse attributes as well, as they don't repeat in measures
   if (xml.getElementsByTagName('attributes').length) {
     this.attributes = new MusicXMLMeasureAttributes(xml.getElementsByTagName('attributes')[0]);
   } 

   this.parseMeasures();
   // TODO: score-instrument, midi-instrument
};

MusicXMLPart.prototype = {
   parseMeasures: function() {
     var measuresXML = this.xml.getElementsByTagName("measure");
     for(var i = 0; i < measuresXML.length; i++) {
        this.measures.push(new MusicXMLMeasure(measuresXML[i],this.attributes));
     };
   },
   toVexFlow: function(ctx,stave) {
      for(var i = 1; i< 7; i++) {
        this.measures[i].toVexFlow(ctx,stave);
      }
   }
};
MusicXMLMeasureAttributes = function(xml) {
   this.xml = xml;
   this.divisions = parseInt(extract_text("divisions",this.xml));
   this.key = {fifths: extract_text("fifths",this.xml)};
   this.time = {beats: extract_text("beats",this.xml), "beat-type": extract_text("beat-type",this.xml)};
   this.clef = {sign: extract_text("sign",this.xml), line: extract_text("line",this.xml)};
};

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

MusicXMLNote = function(xml,attributes) {
   this.xml = xml;
   this.attributes = attributes;
   this.duration = parseInt(this.xml.getElementsByTagName("duration")[0].textContent);
   this.rest = this.isRest();
   this.voice = this.xml.getElementsByTagName("voice")[0].textContent;
   if(!this.rest) {
     this.type = xml.getElementsByTagName("type")[0].textContent;
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

MusicXMLSheet = function(xml) {
   this.xml = xml;
   this.partLists = [];
   this.parts = []
};

MusicXMLSheet.prototype = {
   parse: function() {
      this.parsePartLists();
      this.parseParts();

   },
   parsePartLists: function() {
      var pListXML = this.partListsXML();
      for(var i = 0; i < pListXML.children.length; i++) {
         this.partLists.push(new MusicXMLPartList(pListXML.children[i]));
      };
   },
   partListsXML: function() {
     return this.xml.getElementsByTagName("part-list")[0];
   },
   parseParts: function() {
      for(var i = 0; i < this.partLists.length; i++) {
         this.parts.push(new MusicXMLPart(this.xml.querySelector("part#" + this.partLists[i].id)));
      };

   },
   toVexFlow: function(ctx) {
      var stave = new Vex.Flow.Stave(10,0,500);

      stave.setContext(ctx).draw();
      if(this.parts.length) {
         this.parts[0].toVexFlow(ctx,stave);
      };

      //stave.addClef("treble"); 
      return stave;

   }
};

MusicXMLTimewiseSheet = function(xml) {
   MusicXMLSheet.call(this,xml);
};

MusicXMLTimewiseSheet.prototype = Object.create(MusicXMLSheet.prototype, {

});

MusicXMLPartwiseSheet = function(xml) {
   MusicXMLSheet.call(this,xml);
};


MusicXMLPartwiseSheet.prototype = Object.create(MusicXMLSheet.prototype, {

});

MusicXMLSheet.fromXML = function (xml) {
   if (xml.getElementsByTagName("score-partwise").length) {
      obj =  new MusicXMLPartwiseSheet(xml);
   } else if (obj.xml.getElementsByTagName("score-timewise").length) {
      obj =  new MusicXMLTimewiseSheet(xml);
   }
   obj.parse();
   return obj;
};
