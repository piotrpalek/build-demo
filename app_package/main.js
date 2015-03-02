import 'jquery';
import 'ember/ember-template-compiler';
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

//CONTROLLERS
//NAMES
//CURRENT_COMPONENT_IMPORT

//OTHER_COMPONENTS

if (initializers instanceof Array) {
  initializers.forEach((i) => Ember.Application.initializer(i));
}

//TEMPLATES
import EventsMixin from 'gesture-event-support';

names.forEach((name) => {
  var App = Ember.Application.createWithMixins({
    rootElement: '#' + name,
    Resolver: makeResolver(name)
  }, EventsMixin);
  App.ApplicationController = controllers[name];
});
