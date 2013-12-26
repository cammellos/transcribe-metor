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
      var canvas_width = 700;
      var stave_width = Math.floor(canvas_width / 4) - 4;
      var stave_jump = 100;

      for(var i = 1; i< 7; i++) {
        var tmp_width = stave.width + stave.x;
        var tmp_height = stave.y;
        if (tmp_width > canvas_width) {
           tmp_width = 10;
           tmp_height = tmp_height + stave_jump;
        } 
        var stave = new Vex.Flow.Stave(tmp_width, tmp_height,stave_width);
        stave.setContext(ctx).draw();
        this.measures[i].toVexFlow(ctx,stave);
      }
   }
};
