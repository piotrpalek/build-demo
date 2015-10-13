function controllers(names) {
  var result = [];
  result.push('var controllers = {};');
  names.forEach(function (name) {
    var controllerName = name;
    result.push('import ' + controllerName + ' from \'' + name + '/application\';');
    result.push('controllers.'+controllerName+' = ' + controllerName + ';');
  });
  return result.join("\n");
}

function namesArray(names) {
  var result = [];
  names.forEach(function (name) {
    result.push("'"+ name + "'");
  });
  return 'var names = [' + result.join(',') + '];';
}

function templates(names) {
  var result = [];
  result.push('Object.keys(Ember.TEMPLATES).forEach(function (key) { ');
    names.forEach(function (name) {
      result.push('Ember.TEMPLATES[\''+name+'/\' + key] = Ember.TEMPLATES[key];');
    });
  result.push('});');
  names.forEach(function (name) {
    var templateName = name + 'Template';
    result.push('import ' + templateName + ' from \'' + name + '/application.hbs!\';');
    result.push('Ember.TEMPLATES[\''+name+'/application\'] = ' + templateName + ';');
  });
  return result.join("\n");
}

function component(componentName) {
  return 'import \'' + componentName + '\';\n';
}

function containers(names) {
  var result = [];
  names.forEach(function (name) {
    result.push('<div id="' + name + '"></div>');
  });
  return result.join("\n");
}

function containerFor(name) {
  return '<div id="' + name + '"></div>';
}

function components(dep) {
  var result = [];
  var i = 1;
  Object.keys(dep).forEach(function (name) {
    var varName = 'dep' + i;
    result.push('import \'' + name + '\';\n');
    i++;
  });
  return result.join("\n");
}

function routers(names, namesWithRouter) {
  var result = [];
  result.push('var routers = {};');
  names.filter(function(name) {
      return  namesWithRouter.indexOf(name) !== -1;
    })
    .forEach(function (name) {
      var routerName = 'router' + name;
      result.push('import ' + routerName + ' from \'' + name + '/router\';');
      result.push('routers.'+name+' = ' + routerName + ';');
    });
  return result.join("\n");
}

module.exports = {
  controllers: controllers,
  names: namesArray,
  templates: templates,
  component: component,
  containers: containers,
  components: components,
  routers: routers
}
