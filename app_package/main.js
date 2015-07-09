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

import  'ember-vcl-font-awesome';

//CONTROLLERS
//NAMES
//CURRENT_COMPONENT_IMPORT

//OTHER_COMPONENTS

//TEMPLATES
import EventsMixin from 'gesture-event-support';

//ROUTERS
var AppClass = Ember.Application.extend(EventsMixin);

names.forEach((name) => {
  var App = AppClass.create({
    rootElement: '#' + name,
    Resolver: makeResolver(name)
  });
  App.ApplicationController = controllers[name];
  if (routers[name]) {
    App.Router.map(routers[name]);
  }
});
