import 'jquery';
import Ember from 'ember';

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

var translations = //TRANSLATIONS
;

export default { names, makeResolver, controllers, EventsMixin, routers, translations, Ember};
