Transcribe.MusicXML.Stave = function() {
   this.measures = [];

};
Transcribe.MusicXML.Stave.prototype = {
}


Transcribe.MusicXML.Stave.read = function(xml) {
   var staves = [];
   var divisions = parseInt(Transcribe.Helpers.extractTextFromXML("divisions",xml));
   var key = {fifths: parseInt(Transcribe.Helpers.extractTextFromXML("fifths",xml)), mode: Transcribe.Helpers.extractTextFromXML("mode",xml)};
   var time = {beats: parseInt(Transcribe.Helpers.extractTextFromXML("beats",xml)), "beat-type": parseInt(Transcribe.Helpers.extractTextFromXML("beat-type",xml))};

   var nStaves = xml.getElementsByTagName('staves').length ? parseInt(Transcribe.Helpers.extractTextFromXML('staves', xml)) : 1
   for(var i = 0; i< nStaves; i++) {
     var st = new Transcribe.Models.Stave();
     st.time = time;
     st.divisions = divisions;
     st.key = key;
     st.number = i;
     staves.push(st);
   }
   var clefs = xml.getElementsByTagName("clef");
   for (var i = 0; i < clefs.length; i++) {
     var index = clefs[i].getAttribute("number") ? parseInt(clefs[i].getAttribute("number")) - 1 : 0;
     staves[index].clef = {sign: Transcribe.Helpers.extractTextFromXML("sign",clefs[i]), line: parseInt(Transcribe.Helpers.extractTextFromXML("line",clefs[i]))};
   }
   return staves;
};
