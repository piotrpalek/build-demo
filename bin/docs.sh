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
var attributeComments = [];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isPublic(comment) {
  var i = comment.indexOf('@public');
  if (i === -1) {
    return false;
  } else {
    comment.replace('@public', '');
    return true;
  }
}

function getType(comment) {
  if (comment.indexOf('@action') !== -1) {
    return 'action';
  }
  return 'attribute';
}

function getValueType(property) {
  var re = new RegExp('@type \{(.*?)\}');
  var comment = property.comments || '';
  var found = comment.match(re);
  if (found && found.length > 0) {
    return '{' + capitalizeFirstLetter(found[1]) + '}';
  }
  var t = 'undefined';
  try {
    t = typeof eval(property.defaultValue);
  } catch (err) {
    t = property.defaultValue;
  }
  return '{' + capitalizeFirstLetter(t) + '}';
}


function getDescription(comment) {
  var lines = comment.trimLeft().split('\n');
  var result = lines.filter(function(line) {
    var trimmed = line.trim();
    if (trimmed[0] === '@' || trimmed === '*') {
      return false;
    }
    return true;
  });
  return result.join('<br>');
}

function removeStar(str) {
  return str.replace(/^\s*?\*/gi, '');
}

function detect(property) {
  property.public = false;
  if (property.comments) {
    property.comments = property.comments.map(function(commentObj) {
      return commentObj.value;
    }).map(removeStar).join('\n');
    property.public = isPublic(property.comments);
    property.type = getType(property.comments);
    property.description = getDescription(property.comments)
  } else {
    property.description = 'N/A';
    property.type = 'attribute';
    property.public = false;
  }
  property.valueType = getValueType(property);
  return property;
}

var util = require('util');
// console.log(util.inspect(ast, { showHidden: false, depth: null }));
var mixins = [];

recast.visit(ast, {
  visitComment: function(path) {
    this.traverse(path);
    if (types.Block.check(path.value)
      && path.parent.node.type == 'Program') {
      blockComments.push(path.value);
    }
  },
  visitCallExpression: function(path) {
    this.traverse(path);
    var callee = path.value.callee;
    var pNode = path.parent;
    // Ember.Smth.extend or Ember.Smth.create
    if (callee.property && ['extend', 'create'].indexOf(callee.property.name) !== -1) {
      // Ember.Smth.extend or Ember.Smth.create are top level
      // parent|parent|pNode
      if (pNode.parent.parent.node.type === 'Program') {
        var args = path.value.arguments;
        if (args.length > 1) {
          for (var i = 0; i < args.length - 1; i++) {
            mixins.push(args[i].name);
          }
        }
        var obj = args[args.length - 1];
        recast.visit(obj, {
          visitProperty: function(path) {
            this.traverse(path);
            if (path.parent.value === obj) {
              attributeComments.push(detect({
                name: path.value.key.name,
                comments: path.value.comments,
                defaultValue: path.value.value.raw ? path.value.value.raw : path.value.type
              }));
            }
          }
        });
      }
    }
  }
});

var publicAttributes = attributeComments.filter(function(item) {
  return item.public && item.type !== 'action';
});

var privateAttributes = attributeComments.filter(function(item) {
  return !item.public && item.type !== 'action';
});

var actionAttributes = attributeComments.filter(function(item) {
  return item.type === 'action';
});

if (blockComments.length === 0) {
  console.warn('Block comments are not found');
} else if (blockComments.length > 1) {
  console.warn('There is more than one block comment')
} else {
  console.log('Generating README');
  var comment = blockComments[0].value;
  var lines = comment.split('\n');
  var processedLines = lines.map(function(line) {
    var trimmed = removeStar(line.trim()).trim();
    var spl;
    if (trimmed[0] === '@') {
      if (trimmed.substring(0, '@demo'.length) === '@demo') {
        // embed example link
        spl = trimmed.split(' ');
        return '[' + spl[1] + '](/demo/' + spl[1] + '/)';
      } else if (trimmed.substring(0, '@property'.length) === '@property') {
        spl = trimmed.split('    ').filter(function(item) {
          if (item.trim() === '' || item.trim() === '*') {
            return false;
          }
          return true;
        });

        spl.shift();
        publicAttributes.push({
          name: spl[1],
          valueType: spl[0],
          defaultValue: 'N/A',
          description: spl[2].trimLeft()
        })
        return '';
      }
    } else {
      return removeStar(line);
    }
  })
  .concat(['## Public API'])
  .concat(['### Public Attributes'])
  .concat(['| Name | Type | Default | Description |'])
  .concat(['| ---- | ---- | ------- | ----------- |'])
  .concat(publicAttributes.map(function(p) {
    return ['|' + p.name, p.valueType, '`'+p.defaultValue+'`', p.description + '|'].join('|')
  }))
  .concat(['### Action Attributes'])
  .concat(['| Name | Type | Default | Description |'])
  .concat(['| ---- | ---- | ------- | ----------- |'])
  .concat(actionAttributes.map(function(p) {
    return ['|' + p.name, p.valueType, '`'+p.defaultValue+'`', p.description + '|'].join('|')
  }))
  .concat(['## Included Mixins'])
  .concat(mixins.map(function(p) {
    return [' - ' + p];
  }))
  var result = processedLines.join('\n');
  var privateResult = ['## Private API'].concat(['### Private Attributes'])
  .concat(['| Name | Type | Default | Description |'])
  .concat(['| ---- | ---- | ------- | ----------- |'])
  .concat(privateAttributes.map(function(p) {
    return ['|' + p.name, p.valueType, '`'+p.defaultValue+'`', p.description + '|'].join('|')
  })).join('\n');

  var name = capitalizeFirstLetter(pkg.name.replace('ember-vcl-', ''));
  var readme = ['# [Ember VCL](https://github.com/ember-vcl/doc) ' + name,
  '',
  result,
  '',
  privateResult,
  '',
  '## Running demo locally',
  '',
  '[See instructions how to run a demo app](https://github.com/ember-vcl/build-demo)']
  .join('\n');

  fs.writeFileSync('./README.md', readme);

}
