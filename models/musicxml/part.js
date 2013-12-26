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

