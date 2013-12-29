Package.describe({
  summary: "VexFlow Exporter"
});

Package.on_use(function (api) {
  api.use('transcribe');
  var path = Npm.require('path');
  var asset_path = path.join('models');
  api.add_files(path.join('init.js'), 'client');
  api.add_files(path.join('models','sheet.js'), 'client');

});
Package.on_test(function (api) {
});
