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
   this.parseMeasures();
   // TODO: score-instrument, midi-instrument
};

MusicXMLPart.prototype = {
   parseMeasures: function() {
     var measuresXML = this.xml.getElementsByTagName("measure");
     for(var i = 0; i < measuresXML.length; i++) {
        this.measures.push(new MusicXMLMeasure(measuresXML[i]));
     };
   }
};
MusicXMLMeasureAttributes = function(xml) {
   this.xml = xml;

};

MusicXMLMeasure = function(xml) {
   this.xml = xml;
   this.number = this.xml.getAttribute("number");
   this.attributes = new MusicXMLMeasureAttributes(xml.getElementsByTagName('attributes')[0]);
   this.notes = [];
   this.parseNotes();
};

MusicXMLMeasure.prototype = {
   parseNotes: function() {
     var notesXML = this.xml.getElementsByTagName('note');
     for(var i = 0; i< notesXML.length; i++) {
        this.notes.push(new MusicXMLNote(notesXML[0]));
     }
   }
};

MusicXMLNote = function(xml) {

   this.xml = xml;
   this.duration = this.xml.getElementsByTagName("duration")[0].textContent;
   this.rest = this.isRest();
   this.voice =this. xml.getElementsByTagName("voice")[0].textContent;
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
