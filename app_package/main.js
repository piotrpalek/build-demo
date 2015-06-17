import 'jquery';
import Ember from 'ember';

import 'ember-i18n';
Ember.I18n.I18N_COMPILE_WITHOUT_HANDLEBARS = true;

function makeResolver(name) {
  return Ember.DefaultResolver.extend({
    resolveTemplate: function(parsedName) {
      parsedName.fullNameWithoutType = name + "/" + parsedName.fullNameWithoutType;
      return this._super(parsedName);
    }
  });
}

var executedInstanceInitializers = new Set();
var executedInitializers = new Set();

function executeInitializer(i) {
  if (i.type === 'instance' && !executedInstanceInitializers.has(i.name)) {
    Ember.Application.instanceInitializer(i);
    executedInstanceInitializers.add(i.name);
  } else if (i.type !== 'instance' && !executedInitializers.has(i.name)) {
    Ember.Application.initializer(i);
    executedInitializers.add(i.name);
  }
}

//CONTROLLERS
//NAMES
//CURRENT_COMPONENT_IMPORT

//OTHER_COMPONENTS

if (initializers instanceof Array) {
  initializers.forEach((i) => { executeInitializer(i) });
}

//TEMPLATES
import EventsMixin from 'gesture-event-support';

//ROUTERS
names.forEach((name) => {
  var App = Ember.Application.createWithMixins({
    rootElement: '#' + name,
    Resolver: makeResolver(name)
  }, EventsMixin);
  App.ApplicationController = controllers[name];
  if (routers[name]) {
    App.Router.map(routers[name]);
  }
});
