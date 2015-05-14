System.config({
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.3.3",
    "babel-runtime": "npm:babel-runtime@5.3.3",
    "core-js": "npm:core-js@0.9.8",
    "ember": "github:components/ember@1.13.0-beta.1",
    "ember-i18n": "github:jamesarosen/ember-i18n@3.1.0",
    "gesture-event-support": "github:ember-vcl/gesture-event-support@0.1.0",
    "hbs": "github:n-fuse/plugin-ember-hbs@1.13.0-beta.1",
    "jquery": "github:components/jquery@2.1.4",
    "github:components/ember@1.13.0-beta.1": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:n-fuse/plugin-ember-hbs@1.13.0-beta.1": {
      "ember-template-compiler": "github:n-fuse/ember-template-compiler@1.13.0-beta.1"
    },
    "npm:core-js@0.9.8": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

