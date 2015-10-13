#!/usr/bin/env node

var fs = require('fs');
var recast = require('recast');
var builders = recast.types.builders;
var types = recast.types.namedTypes;

var pkg = require(process.cwd() + '/package.json');
var main = pkg.main;

var mainFile = fs.readFileSync('./' + main, 'utf-8');
var ast = recast.parse(mainFile);

var blockComments = [];
var lineComments = [];

recast.visit(ast, {
  visitComment: function(path) {
    this.traverse(path);
    if (types.Block.check(path.value)) {
      blockComments.push(path.value);
    } else if (types.Line.check(path.value)) {
      lineComments.push(path.value);
    }
  }
});

if (blockComments.length === 0) {
  console.warn('Block comments are not found');
} else if (blockComments.length > 1) {
  console.warn('There is more than one block comment')
} else {
  console.log('Generating README');
  var comment = blockComments[0].value;
  var lines = comment.split('\n');
  var state = 'none';
  var processedLines = lines.map(function(line) {
    var trimmed = line.trim();
    var spl;
    if (line[0] == '@') {
      if (line.substring(0, '@demo'.length) == '@demo') {
        // embed example link
        if (state !== 'none') {
          state = 'none';
        }
        spl = trimmed.split(' ');
        return '[' + spl[1] + '](/demo/' + spl[1] + '/)';
      } else if (line.substring(0, '@property'.length) == '@property') {
        spl = trimmed.split('    ').filter(function(item) {
          if (item.trim() == '') {
            return false;
          }
          return true;
        });

        result = '';
        spl.shift();
        if (state == 'none') {
          state = 'property';
          result = '|' + ['name', 'required', 'description'].join('|') + '|\n';
          result += '|' + spl.map(function() { return '----'}).join('|') + '|\n';
        }
        result += '|' + spl.join('|') + '|';
        return result;
      }
    } else {
      return line;
    }
  });
  var result = processedLines.join('\n');

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var name = capitalizeFirstLetter(pkg.name.replace('ember-vcl-', ''));
  var readme = ['# [Ember VCL](https://github.com/ember-vcl/doc) ' + name,
  '',
  result,
  '',
  '## Running demo locally',
  '',
  '[See instructions how to run a demo app](https://github.com/ember-vcl/build-demo)',
  '',
  '## License',
  '',
  '[MIT license](LICENSE.txt)'].join('\n');

  fs.writeFileSync('./README.md', readme);

}
