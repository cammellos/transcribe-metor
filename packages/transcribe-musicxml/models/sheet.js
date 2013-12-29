Transcribe.MusicXML.Sheet = function(xml) {
   this.partLists = [];
   this.parts = []
};

Transcribe.MusicXML.Sheet.prototype = {
   read: function(xml) {
      this.xml = xml;
      this._parseParts();
      var sheet = new Transcribe.Models.Sheet();
      sheet.title = this._parseTitle();
      sheet.workNumber = this._parseWorkNumber();
      sheet.creators = this._parseCreators();
      sheet.copyright = this._parseCopyright();
      sheet.parts = this._parseParts();
      return sheet;
   },
   write: function(sheet) {
   },
   _parseTitle: function() {
      return Transcribe.Helpers.extractTextFromXML("work-title", this.xml);
   },
   _parseWorkNumber: function() {
      return Transcribe.Helpers.extractTextFromXML("work-number", this.xml);
   },
   _parseCreators: function() {
     var divs = this.xml.getElementsByTagName("creator");
     var creators = [];
     for(var i =0; i< divs.length;i++) {
        creators.push({name: divs[i].textContent, type: divs[i].getAttribute("type")})
     }
     return creators;
   },
   _parseCopyright: function() {
      return Transcribe.Helpers.extractTextFromXML("rights", this.xml);
   },
   _parseParts: function() {
      var pListXML = this.xml.getElementsByTagName("part-list")[0];
      var parts = [];
      for(var i = 0; i < pListXML.children.length; i++) {
         var part = new Transcribe.Models.Part();
         part.id = pListXML.children[i].getAttribute('id');
         part.name = Transcribe.Helpers.extractTextFromXML("part-name", pListXML.children[i]);
         part.instrument = Transcribe.Helpers.extractTextFromXML("instrument-name", pListXML.children[i]);
         part.staves = new Transcribe.MusicXML.Stave.read(this.xml.querySelector("part#" + part.id));
         this._parseMeasures(this.xml.querySelector("part#" + part.id),part);
         parts.push(part);
      };
      return parts;
   },
   _parseMeasures: function(xml,part) {
     var measuresXML = xml.getElementsByTagName("measure");
     for(var j = 0; j < part.staves.length; j++) {
       for(var i = 0; i < measuresXML.length; i++) {
          var measure = new Transcribe.MusicXML.Measure.read(measuresXML[i],part.staves[j]);
          part.staves[j].measures.push(measure);
       };
     };
   },
   toVexFlow: function(ctx) {
      if(this.parts.length) {
         this.parts[0].toVexFlow(ctx);
      };
   }
};

Transcribe.MusicXML.TimewiseSheet = function() {
   Transcribe.MusicXML.Sheet.call(this);
};

Transcribe.MusicXML.TimewiseSheet.prototype = Object.create(Transcribe.MusicXML.Sheet.prototype, {

});

Transcribe.MusicXML.PartwiseSheet = function() {
   Transcribe.MusicXML.Sheet.call(this);
};


Transcribe.MusicXML.PartwiseSheet.prototype = Object.create(Transcribe.MusicXML.Sheet.prototype, {

});

Transcribe.MusicXML.Sheet.fromXML = function (xml) {
   if (xml.getElementsByTagName("score-partwise").length) {
      obj =  new Transcribe.MusicXML.PartwiseSheet();
   } else if (obj.xml.getElementsByTagName("score-timewise").length) {
      obj =  new Transcribe.MusicXML.TimewiseSheet();
   }
   return obj.read(xml);
};
