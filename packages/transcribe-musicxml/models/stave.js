Transcribe.MusicXML.Stave = function() {
   this.measures = [];

};

Transcribe.MusicXML.Stave.read = function(xml) {
   var staves = [];
   var divisions = parseInt(Transcribe.Helpers.extractTextFromXML("divisions",xml));
   var key = {fifths: Transcribe.Helpers.extractTextFromXML("fifths",xml)};
   var time = {beats: Transcribe.Helpers.extractTextFromXML("beats",xml), "beat-type": Transcribe.Helpers.extractTextFromXML("beat-type",xml)};

   var nStaves = xml.getElementsByTagName('staves').length ? parseInt(Transcribe.Helpers.extractTextFromXML('staves', xml)) : 1
   for(var i = 0; i< nStaves; i++) {
     var st = new Transcribe.MusicXML.Stave();
     st.time = time;
     st.divisions = divisions;
     st.key = key;
     staves.push(st);
   }
   var clefs = xml.getElementsByTagName("clef");
   for (var i = 0; i < clefs.length; i++) {
     var index = clefs[i].getAttribute("number") ? parseInt(clefs[i].getAttribute("number")) - 1 : 0;
     staves[index].clef = {sign: Transcribe.Helpers.extractTextFromXML("sign",clefs[i]), line: Transcribe.Helpers.extractTextFromXML("line",clefs[i])};
   }
   return staves;
};
