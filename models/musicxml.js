extract_text = function(attr,xml) {
  var tmp = xml.getElementsByTagName(attr);
  if (tmp.length) {
    return tmp[0].textContent;
  }
};

