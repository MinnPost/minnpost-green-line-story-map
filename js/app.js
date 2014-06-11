/**
 * Main application file for: minnpost-green-line-story-map
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
define('minnpost-green-line-story-map', [
  'jquery', 'underscore', 'storymap',
  'mpConfig', 'mpStorymaps', 'helpers',
  'text!templates/application.underscore',
  'text!../data/story-map.json'
], function(
  $, _, storymap, mpConfig, mpStorymaps,
  helpers, tApplication, dStorymap
  ) {

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.el = this.options.el;
    this.$el = $(this.el);
    this.$ = function(selector) { return this.$el.find(selector); };
    this.$content = this.$el.find('.content-container');
    this.loadApp();
  };

  // Extend with custom methods
  _.extend(App.prototype, {
    // Start function
    start: function() {
      var thisApp = this;

      // Create main application view
      this.$el.html(_.template(tApplication, {
        data: {
        }
      }));

      // To ensure template DOM is loaded, wait a moment
      _.delay(function() {
        thisApp.build();
      }, 400);
    },

    // Build story map
    build: function() {
      var thisApp = this;

      // Replace image paths and parse JSON
      dStorymap = dStorymap.replace(/\[\[\[IMAGE_PATH\]\]\]/g, this.options.paths.images);
      this.data = JSON.parse(dStorymap);

      // Make map
      this.sMap = mpStorymaps.makeStorymap('green-line-story-map', this.data, true);

      // Get rid of loaded, once map is loaded
      this.sMap._map.on('loaded', function() {
        thisApp.$('.initial.loading-block').slideUp('fast');
      });
    },

    // Default options
    defaultOptions: {
      projectName: 'minnpost-green-line-story-map',
      remoteProxy: null,
      el: '.minnpost-green-line-story-map-container',
      availablePaths: {
        local: {

          css: ['.tmp/css/main.css'],
          images: 'images/',
          data: 'data/'
        },
        build: {
          css: [
            '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
            'dist/minnpost-green-line-story-map.libs.min.css',
            'dist/minnpost-green-line-story-map.latest.min.css'
          ],
          ie: [
            'dist/minnpost-green-line-story-map.libs.min.ie.css',
            'dist/minnpost-green-line-story-map.latest.min.ie.css'
          ],
          images: 'dist/images/',
          data: 'dist/data/'
        },
        deploy: {
          css: [
            '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-story-map/minnpost-green-line-story-map.libs.min.css',
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-story-map/minnpost-green-line-story-map.latest.min.css'
          ],
          ie: [
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-story-map/minnpost-green-line-story-map.libs.min.ie.css',
            'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-story-map/minnpost-green-line-story-map.latest.min.ie.css'
          ],
          images: 'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-story-map/images/',
          data: 'https://s3.amazonaws.com/data.minnpost/projects/minnpost-green-line-story-map/data/'
        }
      }
    },

    // Load up app
    loadApp: function() {
      this.determinePaths();
      this.getLocalAssests(function(map) {
        this.renderAssests(map);
        this.start();
      });
    },

    // Determine paths.  A bit hacky.
    determinePaths: function() {
      var query;
      this.options.deployment = 'deploy';

      if (window.location.host.indexOf('localhost') !== -1) {
        this.options.deployment = 'local';

        // Check if a query string forces something
        query = helpers.parseQueryString();
        if (_.isObject(query) && _.isString(query.mpDeployment)) {
          this.options.deployment = query.mpDeployment;
        }
      }

      this.options.paths = this.options.availablePaths[this.options.deployment];
    },

    // Get local assests, if needed
    getLocalAssests: function(callback) {
      var thisApp = this;

      // If local read in the bower map
      if (this.options.deployment === 'local') {
        $.getJSON('bower.json', function(data) {
          callback.apply(thisApp, [data.dependencyMap]);
        });
      }
      else {
        callback.apply(this, []);
      }
    },

    // Rendering tasks
    renderAssests: function(map) {
      var isIE = (helpers.isMSIE() && helpers.isMSIE() <= 8);

      // Add CSS from bower map
      if (_.isObject(map)) {
        _.each(map, function(c, ci) {
          if (c.css) {
            _.each(c.css, function(s, si) {
              s = (s.match(/^(http|\/\/)/)) ? s : 'bower_components/' + s + '.css';
              $('head').append('<link rel="stylesheet" href="' + s + '" type="text/css" />');
            });
          }
          if (c.ie && isIE) {
            _.each(c.ie, function(s, si) {
              s = (s.match(/^(http|\/\/)/)) ? s : 'bower_components/' + s + '.css';
              $('head').append('<link rel="stylesheet" href="' + s + '" type="text/css" />');
            });
          }
        });
      }

      // Get main CSS
      _.each(this.options.paths.css, function(c, ci) {
        $('head').append('<link rel="stylesheet" href="' + c + '" type="text/css" />');
      });
      if (isIE) {
        _.each(this.options.paths.ie, function(c, ci) {
          $('head').append('<link rel="stylesheet" href="' + c + '" type="text/css" />');
        });
      }

      // Add a processed class
      this.$el.addClass('processed');
    }
  });

  return App;
});


/**
 * Run application
 */
require(['jquery', 'minnpost-green-line-story-map'], function($, App) {
  $(document).ready(function() {
    var app = new App();
  });
});
