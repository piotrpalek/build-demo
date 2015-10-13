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

export default { names, makeResolver };
