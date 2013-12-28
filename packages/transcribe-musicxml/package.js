Package.describe({
  summary: "MusicXML Parser"
});

Package.on_use(function (api) {
  api.use('transcribe');
  var path = Npm.require('path');
  var asset_path = path.join('models');
  api.add_files(path.join('init.js'), 'client');
  api.add_files(path.join(asset_path, 'note.js'), 'client');
  api.add_files(path.join(asset_path, 'measure.js'), 'client');
  api.add_files(path.join(asset_path, 'part.js'), 'client');
  api.add_files(path.join(asset_path, 'stave.js'), 'client');
  api.add_files(path.join(asset_path, 'sheet.js'), 'client');

});
Package.on_test(function (api) {
  var path = Npm.require('path');
  api.use(['transcribe','transcribe-musicxml', 'tinytest', 'test-helpers'], 'client');
  api.add_files(path.join('tests', 'sheet.js'));
});
