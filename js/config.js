/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {

  },
  baseUrl: 'js',
  paths: {
    'requirejs': '../bower_components/requirejs/require',
    'almond': '../bower_components/almond/almond',
    'text': '../bower_components/text/text',
    'jquery': '../bower_components/jquery/dist/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'storymap-orig': '../bower_components/StoryMapJS/build/js/storymap',
    'storymap': 'storymap-shim',
    'mpConfig': '../bower_components/minnpost-styles/dist/minnpost-styles.config',
    'mpStorymaps': '../bower_components/minnpost-styles/dist/minnpost-styles.storymaps',
    'minnpost-green-line-story-map': 'app'
  }
});