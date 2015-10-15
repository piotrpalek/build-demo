import 'jquery';
import Ember from 'ember';

import * as Utils from 'ember-utils';

import L10nService from 'l10n';
Utils.registerService('l10n', L10nService);

import RouterService from 'router';
Utils.registerService('router', RouterService);

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

export default { names, makeResolver, controllers, EventsMixin, routers};
