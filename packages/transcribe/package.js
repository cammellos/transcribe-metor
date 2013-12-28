Package.describe({
  summary: "Transcribe base Classes"
});

Package.on_use(function (api) {
  var path = Npm.require('path');
  api.add_files(path.join('init.js'), ['client','server']);
  api.add_files(path.join('helpers.js'), ['client','server']);
  api.add_files(path.join('models','sheet.js'), ['client','server']);
  api.add_files(path.join('models','part.js'), ['client','server']);
  api.add_files(path.join('models','stave.js'), ['client','server']);
  api.add_files(path.join('models','measure.js'), ['client','server']);
  api.add_files(path.join('models','note.js'), ['client','server']);
  api.export('Transcribe');
});
