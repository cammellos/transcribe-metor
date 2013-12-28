Transcribe.MusicXML.MeasureAttributes = function(xml) {
   this.xml = xml;
   this.divisions = parseInt(Transcribe.Helpers.extractTextFromXML("divisions",this.xml));
   this.key = {fifths: Transcribe.Helpers.extractTextFromXML("fifths",this.xml)};
   this.time = {beats: Transcribe.Helpers.extractTextFromXML("beats",this.xml), "beat-type": Transcribe.Helpers.extractTextFromXML("beat-type",this.xml)};
   this.clef = {sign: Transcribe.Helpers.extractTextFromXML("sign",this.xml), line: Transcribe.Helpers.extractTextFromXML("line",this.xml)};
};

