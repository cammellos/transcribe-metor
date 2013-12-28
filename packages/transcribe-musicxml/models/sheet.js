Transcribe.MusicXML.Sheet = function(xml) {
   this.partLists = [];
   this.parts = []
};

Transcribe.MusicXML.Sheet.prototype = {
   read: function(xml) {
      this.xml = xml;
      this.parseParts();
   },
   write: function(sheet) {
   },
   parseParts: function() {
      var pListXML = this.partListsXML();
      for(var i = 0; i < pListXML.children.length; i++) {
         var partList = new Transcribe.MusicXML.PartList(pListXML.children[i]);
         this.partLists.push(partList);
         this.parts.push(new Transcribe.MusicXML.Part(this.xml.querySelector("part#" + partList.id)));
      };
   },
   partListsXML: function() {
     return this.xml.getElementsByTagName("part-list")[0];
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
   obj.read(xml);
   return obj;
};
