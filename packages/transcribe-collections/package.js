Package.describe({
  summary: "Transcribe collections"
});

Package.on_use(function (api) {
  api.use('meteor');
  api.use('check');
  api.use('transcribe');
  var path = Npm.require('path');
  var collections_path = path.join('collections');
  api.add_files(path.join('init.js'), ['client','server']);
  api.add_files(path.join(collections_path, 'sheets.js'), ['client','server']);
});
