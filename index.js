var fs = require('fs-extra');
var generator = require('./generator');
var target = process.argv[2]; // first param
var path = require('path');
var fsn = require('fs');

if (!target) {
  console.log('Target is not defined');
  return;
}

if (target[target.length - 1] !== '/') {
  target += '/';
}

var names = fs.readdirSync(target + 'demo');
var componentName = 'ember-vcl-' + path.basename(path.resolve(target));

console.log("Found the following demos: ", names);
console.log("Component name: ", componentName);

fs.removeSync('./tmp');
fs.ensureDirSync('./tmp');
fs.copySync('./app_package', './tmp');

var mainjs = fs.readFileSync('./tmp/main.js', 'utf-8');

mainjs = mainjs.replace('//CONTROLLERS', generator.controllers(names));
mainjs = mainjs.replace('//NAMES', generator.names(names));
mainjs = mainjs.replace('//TEMPLATES', generator.templates(names));
mainjs = mainjs.replace('//CURRENT_COMPONENT_IMPORT', generator.component(componentName));

fs.writeFileSync('./tmp/main.js', mainjs);

var packagejson = fs.readJSONSync('./tmp/package.json');
packagejson.jspm.dependencies[componentName] = componentName.replace('ember-vcl-', 'github:ember-vcl/');
fs.outputJSONSync('./tmp/package.json', packagejson);


var indexhtml = fs.readFileSync('./tmp/index.html', 'utf-8');
var indexhtml = indexhtml.replace('</body>', generator.containers(names) + '\n</body>');
fs.writeFileSync('./tmp/index.html', indexhtml);


var filesToCopy = [
  'vcl.css',
  'package.json',
  'main.js',
  'index.html',
  'gulpfile.js',
  'config.js!',
  'overrides/ember.json',
  'fonts/FontAwesome.otf',
  'fonts/fontawesome-webfont.eot',
  'fonts/fontawesome-webfont.svg',
  'fonts/fontawesome-webfont.ttf',
  'fonts/fontawesome-webfont.woff',
];

filesToCopy.forEach(function (f) {
  var copy = true;
  if (f[f.length - 1] === '!') {
    f = f.substring(0, f.length - 1);
    if (fsn.existsSync(target + 'tmp/' + f)) {
      copy = false;
      console.log('Not overwriting ' + f + ' in the folder ' + componentName + '/tmp' );
    }
  }
  if (copy) {
    console.log('Copying ' + f + ' to the folder ' + componentName + '/tmp' );
    fs.copySync('./tmp/' + f, target + 'tmp/' + f);
  }
});

fs.ensureDirSync(target + 'tmp/');

names.forEach(function (name) {
  var src = path.resolve(target + 'demo/' + name);
  var dest = path.resolve(target + 'tmp/' + name);
  console.log('Creating symlinks: ' + src + ' -> ' + dest);
  fs.symlinkSync(src, dest);
});

fs.removeSync('./tmp');
