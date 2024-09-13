'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    'ember-test-selectors': {
      strip: false,
    },

    // Add options here
  });

  return app.toTree();
};
