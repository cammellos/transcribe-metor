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
      var canvas_width = 700;
      var stave_width = canvas_width / 4;
      var stave = new Vex.Flow.Stave(10,0,stave_width);
      stave.setContext(ctx).draw();
      if(this.parts.length) {
         this.parts[0].toVexFlow(ctx,stave);
      };

      stave.addClef("treble"); 
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
