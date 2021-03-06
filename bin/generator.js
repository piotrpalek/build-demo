#!/usr/bin/env node

var path = require('path');
var appRoot = path.resolve(__dirname) + '/../';
var tmp = require('tmp');
var fs = require('fs-extra');
var rstcTranslations = require('rstc-translations');
var path = require('path');
var fsn = require('fs');
var rimraf = require('rimraf');
var generator = require('../lib/code-generator');

var target = process.argv[2]; // first param
var edge = false;
if (process.argv.length > 3) {
  edge = process.argv[3];
}

if (!target) {
  console.log('Target is not defined');
  return;
}

if (target[target.length - 1] !== '/') {
  target += '/';
}

var tmpDir = tmp.dirSync();
var tmpDirName = tmpDir.name;
var names = fs.readdirSync(target + 'demo');
var componentName = 'ember-vcl-' + path.basename(path.resolve(target));

console.log('Found the following demos: ', names);
console.log('Component name: ', componentName);

fs.copySync(appRoot + './app_package', tmpDirName);
var mainjs = fs.readFileSync(tmpDirName + '/main.js', 'utf-8');

rstcTranslations.toJSON({
  src: './'
}, function(err, translations) {
  mainjs = mainjs.replace('//TRANSLATIONS', JSON.stringify(translations, null, 2));
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

  fs.writeFileSync(tmpDirName + '/main.js', mainjs);

  var packagejson = fs.readJSONSync(tmpDirName + '/package.json');
  packagejson.jspm.dependencies[componentName] = componentName.replace('ember-vcl-', 'github:ember-vcl/') + '@master';

  Object.keys(dependencies).forEach(function (key) {
    packagejson.jspm.dependencies[key] = dependencies[key];
  });
  fs.outputJSONSync(tmpDirName + '/package.json', packagejson);

  var indexhtml = fs.readFileSync(tmpDirName + '/index.html', 'utf-8');
  names.forEach(function (exampleName) {
    var exampleIndexHtml = indexhtml
      .replace('</body>', generator.containerFor(exampleName) + '\n</body>')
      .replace('CURRENT_NAME', exampleName);
    fs.writeFileSync(tmpDirName + '/' + exampleName + '.html', exampleIndexHtml);
  });

  var filesToCopy = [
    'edge-package.json',
    'package.json',
    'main.js',
    'gulpfile.js',
    'config.js!',
    'gh-pages.sh',
    'index.html'
  ];

  var links = names.map(function(n) {
    return `<a href="${n}.html">${n}</a>`;
  });

  fs.writeFileSync(tmpDirName + '/index.html', '<html><body> ' + links.join('<br>') + '</body></html>');

  names.forEach(function (exampleName) {
    filesToCopy.push(exampleName+'.html');
  });

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
      fs.copySync(tmpDirName + '/' + f, target + 'tmp/' + f);
    }
  });

  if (edge) {
    fs.copySync(tmpDirName + '/edge-package.json', target + 'tmp/package.json');
  }

  names.forEach(function (name) {
    var src = path.resolve(target + 'demo/' + name);
    var dest = path.resolve(target + 'tmp/' + name);
    console.log('Creating symlinks: ' + src + ' -> ' + dest);
    try {
      fs.symlinkSync(src, dest);
    } catch (e) {}
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

  rimraf.sync(tmpDirName);
});


