var fs = require('fs-extra');
var generator = require('./generator');

fs.removeSync('./tmp');
fs.ensureDirSync("./tmp");
fs.copySync('./app_package', './tmp');

var mainjs = fs.readFileSync('./tmp/main.js', 'utf-8');
var names = ['example1', 'example2'];
var componentName = 'ember-vcl-navigation';

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

var target = process.argv[2];

if (target) {
  fs.copySync('./tmp', target + 'tmp');
  fs.copySync(target + 'demo/example1', target + 'tmp/example1');
  fs.copySync(target + 'demo/example2', target + 'tmp/example2');
} else {
  console.log('Target is not defined');
}