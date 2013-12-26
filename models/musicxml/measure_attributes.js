MusicXMLMeasureAttributes = function(xml) {
   this.xml = xml;
   this.divisions = parseInt(extract_text("divisions",this.xml));
   this.key = {fifths: extract_text("fifths",this.xml)};
   this.time = {beats: extract_text("beats",this.xml), "beat-type": extract_text("beat-type",this.xml)};
   this.clef = {sign: extract_text("sign",this.xml), line: extract_text("line",this.xml)};
};

