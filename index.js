var fs = require('fs-extra');
var generator = require('./generator');
var target = process.argv[2]; // first param
var edge = false;

if (process.argv.length > 3) {
  edge = process.argv[3];
}

var path = require('path');
var fsn = require('fs');

if (!target) {
  console.log('Target is not defined');
  return;
}

if (target[target.length - 1] !== '/') {
  target += '/';
}

// fs.removeSync(target + 'tmp/');
fs.ensureDirSync(target + 'tmp/');

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

var dependencies = {};
var namesWithRouter = [];
names.forEach(function (name) {
  var fname = target + 'demo/' + name + '/package.json';
  if (fsn.existsSync(fname)) {
    var file = fs.readJSONSync(fname);
    var deps = file.jspm.dependencies;
    Object.keys(deps).forEach(function (key) {
      dependencies[key] = deps[key];
    });
  }

  var routerName = target + 'demo/' + name + '/router.js';
  if (fsn.existsSync(routerName)) {
    namesWithRouter.push(name);
  }
});

console.log('Additional dependencies', dependencies);

mainjs = mainjs.replace('//ROUTERS', generator.routers(names, namesWithRouter));

mainjs = mainjs.replace('//OTHER_COMPONENTS', generator.components(dependencies));

fs.writeFileSync('./tmp/main.js', mainjs);

var packagejson = fs.readJSONSync('./tmp/package.json');
packagejson.jspm.dependencies[componentName] = componentName.replace('ember-vcl-', 'github:ember-vcl/') + '@master';

Object.keys(dependencies).forEach(function (key) {
  packagejson.jspm.dependencies[key] = dependencies[key];
});
fs.outputJSONSync('./tmp/package.json', packagejson);

['./tmp/index.html', './tmp/index-production.html'].forEach(function (name) {
  var indexhtml = fs.readFileSync(name, 'utf-8');
  indexhtml = indexhtml.replace('</body>', generator.containers(names) + '\n</body>');
  fs.writeFileSync(name, indexhtml);
})

var filesToCopy = [
  'edge-package.json',
  'package.json',
  'main.js',
  'index.html',
  'index-production.html',
  'gulpfile.js',
  'config.js!',
  'gh-pages.sh'
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

if (edge) {
  fs.copySync(target + 'tmp/edge-package.json', target + 'tmp/package.json');
}

names.forEach(function (name) {
  var src = path.resolve(target + 'demo/' + name);
  var dest = path.resolve(target + 'tmp/' + name);
  console.log('Creating symlinks: ' + src + ' -> ' + dest);
  try {
    fs.symlinkSync(src, dest);
  } catch (e) {
  }
});

if (fs.existsSync(target + 'test')) {
  var src = path.resolve(target + 'test');
  var dest = path.resolve(target + 'tmp/' + 'test');
  console.log('Creating symlinks: ' + src + ' -> ' + dest);
  try {
    fs.symlinkSync(src, dest);
  } catch (e) {
  }
}

fs.removeSync('./tmp');
