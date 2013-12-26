MusicXMLPartList = function(xml) {
   this.xml = xml;
   this.id = xml.getAttribute('id');
   this.partName = xml.getElementsByTagName("part-name")[0].childNodes[0].textContent;
   // TODO: score-instrument, midi-instrument
};

