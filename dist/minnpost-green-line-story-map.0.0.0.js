
/**
 * Helpers functions such as formatters or extensions
 * to libraries.
 */
define('helpers', ['jquery', 'underscore'],
  function($, _) {

  var helpers = {};

  /**
   * Override Backbone's ajax call to use JSONP by default as well
   * as force a specific callback to ensure that server side
   * caching is effective.
   */
  helpers.overrideBackboneAJAX = function() {
    Backbone.ajax = function() {
      var options = arguments;

      if (options[0].dataTypeForce !== true) {
        options[0].dataType = 'jsonp';
        options[0].jsonpCallback = 'mpServerSideCachingHelper' +
          _.hash(options[0].url);
      }
      return Backbone.$.ajax.apply(Backbone.$, options);
    };
  };

  /**
   * Returns version of MSIE.
   */
  helpers.isMSIE = function() {
    var match = /(msie) ([\w.]+)/i.exec(navigator.userAgent);
    return match ? parseInt(match[2], 10) : false;
  };

  /**
   * Wrapper for a JSONP request, the first set of options are for
   * the AJAX request, while the other are from the application.
   */
  helpers.jsonpRequest = function(requestOptions, appOptions) {
    options.dataType = 'jsonp';
    options.jsonpCallback = 'mpServerSideCachingHelper' +
      _.hash(options.url);

    if (appOptions.remoteProxy) {
      options.url = options.url + '&callback=mpServerSideCachingHelper';
      options.url = appOptions.remoteProxy + encodeURIComponent(options.url);
      options.cache = true;
    }

    return $.ajax.apply($, [options]);
  };

  /**
   * Data source handling.  For development, we can call
   * the data directly from the JSON file, but for production
   * we want to proxy for JSONP.
   *
   * `name` should be relative path to dataset
   * `options` are app options
   *
   * Returns jQuery's defferred object.
   */
  helpers.getLocalData = function(name, options) {
    var useJSONP = false;
    var defers = [];
    name = (_.isArray(name)) ? name : [ name ];

    // If the data path is not relative, then use JSONP
    if (options && options.paths && options.paths.data.indexOf('http') === 0) {
      useJSONP = true;
    }

    // Go through each file and add to defers
    _.each(name, function(d) {
      var defer;

      if (useJSONP) {
        defer = helpers.jsonpRequest({
          url: proxyPrefix + encodeURI(options.paths.data + d)
        }, options);
      }
      else {
        defer = $.getJSON(options.paths.data + d);
      }
      defers.push(defer);
    });

    return $.when.apply($, defers);
  };

  /**
   * Reads query string and turns into object.
   */
  helpers.parseQueryString = function() {
    var assoc  = {};
    var decode = function(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    _.each(keyValues, function(v, vi) {
      var key = v.split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    });

    return assoc;
  };

  return helpers;
});


define('text!templates/application.underscore',[],function () { return '<div class="application-container">\n  <div class="message-container"></div>\n\n  <div class="content-container">\n\n    <div class="initial loading-block"></div>\n\n    <div id="green-line-story-map" class="storymap"></div>\n\n  </div>\n\n  <div class="footnote-container">\n    <div class="footnote">\n      <p>Some map data © OpenStreetMap contributors; licensed under the <a href="http://www.openstreetmap.org/copyright" target="_blank">Open Data Commons Open Database License</a>.  Some map design © MapBox; licensed according to the <a href="http://mapbox.com/tos/" target="_blank">MapBox Terms of Service</a>.  Some code, techniques, and data on <a href="https://github.com/minnpost/minnpost-green-line-story-map" target="_blank">Github</a>.</p>\n\n    </div>\n  </div>\n</div>\n';});


define('text!templates/fallback.underscore',[],function () { return '<div class="fallback-content">\n\n  <% _.each(storymap.slides, function(s, si) { %>\n\n    <div class="slide cf <%= (s.type) ?  s.type : \'\' %>">\n      <% if (s.media) { %>\n        <div class="image-group">\n          <img src="<%= s.media.url %>" />\n          <div class="caption"><%= s.media.credit %></div>\n        </div>\n      <% } %>\n\n      <div class="text-group">\n        <h3><%= s.text.headline %></h3>\n\n        <%= s.text.text %>\n      </div>\n    </div>\n\n  <% }); %>\n\n</div>\n';});


define('text!../data/story-map.json',[],function () { return '{\n  "storymap": {\n    "slides": [\n      {\n        "type": "overview",\n        "text": {\n          "headline": "",\n          "text": "<p>There\'s been a lot of hubbub about the travel time between the two downtowns, but if you\'re only using the Green Line as an express route, you\'re missing out. Every one of the 18 stations is in the middle of a distinct neighborhood, each one quite a bit different from the next one on the line.</p><p>We\'ll be walking around each of these stations, highlighting a site in the immediate area that\'s interesting, noteworthy, iconic, overlooked, or otherwise worth looking at. This week we\'ll begin at the West Bank station, and travel halfway down the line to the Hamline Avenue station. Next week we\'ll pick up again at Lexington Parkway and continue to Union Depot in Lowertown St. Paul.</p>"\n        }\n      },\n\n      {\n        "location": {\n          "name": "West Bank",\n          "lat": 44.97196300708834,\n          "lon": -93.24609014259524,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "West Bank",\n          "text": "<p><strong>Alley between Acadia Café and Bailey Building</strong></p><p>There’s enough to see, do, eat and drink on the West Bank to keep you busy for years, but one of my favorite uses of space in this part of the city is Acadia’s outdoor seating, in the sliver of space between its building and the Bailey Building. It’s just some tables and lights strung overhead, emptying out into the tangle of apartment stoops and stacked kayaks from next-door Midwest Mountaineering behind the buildings. This alley is also the entrance to independent radio station KFAI’s studios, which means you might get lucky enough to see your favorite host coming or going (I’m a Ron “Boogiemonster” Gerber man myself).</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]01-west_bank.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "East Bank",\n          "lat": 44.97364898727511,\n          "lon": -93.23357733433627,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "East Bank",\n          "text": "<p><strong>Big Ten Restaurant & Bar, 606 Washington Ave. S.E.</strong></p><p>Probably the best collection of vintage Minnesota sports memorabilia around, the Big Ten has been open since the 1950s, and TV screens aside, it looks pretty much like it must have then, down to the dark wood booths. Between semesters, it’s pretty quiet, with a few townies watching the hockey playoffs the night I dropped in. Pieces of the old Memorial Stadium and Mariucci Arena are here, but the best piece of Gopheriana is in the back room. It’s an autographed triptych of Minnesota alum and future Vikings head coach Bud Grant, pictured in three action-packed photos suited up in his basketball, football and baseball attire. Grant lettered in all three sports while at the U. He’s still the only athlete ever to have played in the NFL and the NBA at the same time, during the 1950 season.</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]02-east_bank.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Stadium Village",\n          "lat": 44.974775,\n          "lon": -93.222875,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Stadium Village",\n          "text": "<p><strong>Boomtown Karaoke / Shin’s Hair Salon, 211 Oak St. S.E.</strong></p><p>Twenty dollars gets you an hour in one of four small rooms over the hair salon, each furnished with some chairs and couches, and a top-flight karaoke system loaded with Top 40 hits, ’80s standards, and a binder’s worth of J- and K-pop. Aside from the singing, seeing the videos that accompany most of these songs is their own reward. Singing in a noraebang, as these karaoke rooms are called in Korea, is a much different, much more intimate experience than watching a college bro sing Journey for hooting, disinterested drunk people in a bar. It’s just you, your friends, and whatever songs you know. Since there’s no alcohol served, Boomtown doesn’t need to close when the bars do, which means you can stay until 4 a.m. on weekends.</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]03-stadium_village.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Prospect Park",\n          "lat": 44.971655,\n          "lon": -93.215249,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Prospect Park",\n          "text": "<p><strong>Samuel & Emily Eustis House, 3107 4th St. S.E.</strong></p><p>The train turns here off of University, and the Prospect Park station rests in the shadows of two iconic neighborhood landmarks – the Witch’s Hat to the north, and the United Crushers ADM silos to the south. A block or two east of the platform there’s an interesting example of how historical buildings can be renovated out of existence over the course of decades. At the corner of Malcolm Ave. and 4th Street, there’s a thoroughly unremarkable siding-and-stucco duplex – it looks like typical student housing, even down to the discarded red Solo cups on the back porch. Buried beneath the stucco duplex drag, there’s an old farmhouse, dating from 1865. It was built by members of the Eustis family, who farmed on the land before it was platted into Prospect Park. It’s easily one of the oldest houses in this part of Minneapolis, though you’d never know by looking at it. The chimney on top looks like it might be the only visible remnant.</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]04-prospect_park.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Westgate",\n          "lat": 44.967474,\n          "lon": -93.206403,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Westgate",\n          "text": "<p><strong>Schneider Drug, 3400 University Ave S.E.</strong></p><p>Tom Sengupta’s pharmacy is located about halfway between Minneapolis and St. Paul, near the University of Minnesota, in what he once described as “the intellectual epicenter of Minnesota.” You can see from the outside that Schneider Drug is not simply a pharmacy, but also a type of community center. The front window is given over completely to a silver tinsel-backed display of handwritten slogans and signage related to education, health care and immigration. On the side of the building is a collection of quotations culminating in the hopeful assertion that “We are on the verge of a GREAT AMERICAN RENAISSANCE.” Inside, Sengupta himself is usually at the center of things, unmistakable in his pharmacist’s jacket and shock of white hair.</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]05-westgate.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Raymond Ave.",\n          "lat": 44.963129,\n          "lon": -93.195519,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Raymond Ave.",\n          "text": "<p><strong>Big Al’s and Soth Studios, 856 Raymond Ave.</strong></p><p>The neighborhoods around this station are dubbed the Creative Enterprise Zone, and when they needed an iconic image for a nearby billboard to put that idea across, they picked Alec Soth’s photograph Peter’s Houseboat, Winona, Minnesota 2002. Soth’s studio is located a block north of the billboard on Raymond, in a one-story office building with the auspicious name of “Lakes and Plains.” Though the studio is not usually open to the public, you can drop by Big Al’s next door, Soth’s printing and scanning service, which works with photographers all over the country. Incidentally, the studio is widely known in the artistic community as a hotbed of table tennis activity. Each employee apparently has his/her own nickname. I knew a guy who dropped in for a match recently. “Who you’d play?” I asked. “I don’t know,” he said. “They just called him ‘The Gravedigger.’ ”</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]06-raymond.jpg",\n          "credit": "MinnPost photo by Carrie Thompson",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Fairview Ave.",\n          "lat": 44.95641,\n          "lon": -93.178762,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Fairview Ave.",\n          "text": "<p><strong>Iris Park, Lynnhurst and Iris Aves.</strong></p><p>You can’t walk three miles in the Twin Cities without stepping foot over the site of a defunct amusement park. One such site, called Union Park, was located here in the 19th  century. While it’s long gone, its physical footprint – the loping, off-grid streets – and its name remain. “Artistic and beautiful winding roads” was how the Union Park neighborhood was sold to eager homesteaders, once the land was platted. There are still a number of modest, attractive Victorian homes along tiny, green Iris Park. This was also one of the stops for the Short Line between the two cities, so like many places in the area, you can walk from a quiet sylvan setting into an industrial site on a railroad track in less than three blocks. There are some great hand-painted murals on some of the nearby businesses, buffering the residential and industrial areas, including this smiley Max Fleischman-style dog at M&J Auto Repair.</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]07-fairview.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Snelling Ave.",\n          "lat": 44.955677,\n          "lon": -93.166976,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Snelling Ave.",\n          "text": "<p><strong>Ax-Man Surplus, 1639 University Ave. W.</strong></p><p>In a dead heat with the Art Cellar at MCAD and Hymie’s Records for the best handmade shop signage in the Twin Cities, Ax-Man is already near the top of most Twin Citians’ list of local treasures. But even if you don’t need 45-degree on-off electrical switches, surplus German military berets, or thousands and thousands of tiny glass bottles, you should still drop by to appreciate the hilarious cardboard-Sharpie-and-collage signage. And if you do happen to see something you need, buy it anyway. “No credit card limit,” explained one of the clerks. “But I’d like it to be more than a dollar.”</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]08-snelling.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "location": {\n          "name": "Hamline Ave.",\n          "lat": 44.955699,\n          "lon": -93.156832,\n          "zoom": 16,\n          "line": true\n        },\n        "text": {\n          "headline": "Hamline Ave.",\n          "text": "<p><strong>Urban Lights Music, 1449 University Ave. W.</strong></p><p>Tim Wilson has been running this record shop since 1993, when he bought it from an old location of Northern Lights Records – hence its name. There’s a great, inexpensively priced selection, but maybe the best part of the shop is the wall of fame in the back. Almost anyone who’s anyone in hip-hop has stopped in over the last two decades while on tour, and most have left some kind of signed artifact behind. Some even before they were famous – Tim mentioned a time in 1994 or so when they cleared out the back for a freestyle battle with two guys from Atlanta calling themselves OutKast whose first album had just come out. Joining them was a very young Slug of Atmosphere, a few years away form his first album. To have been in attendance for something like that is one of those mythical stories people tell their friends for years. All those mythical stories are preserved in the glass case in the back of Urban Lights.</p>"\n        },\n        "media": {\n          "url": "[[[IMAGE_PATH]]]09-hamline.jpg",\n          "credit": "MinnPost photo by Andy Sturdevant",\n          "caption": ""\n        }\n      },\n\n      {\n        "type": "overview",\n        "text": {\n          "headline": "",\n          "text": "<p><strong>Next week:</strong> Lexington Parkway to Union Depot in St. Paul.</p>"\n        }\n      }\n    ]\n  }\n}\n';});

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
  'text!templates/fallback.underscore',
  'text!../data/story-map.json'
], function(
  $, _, storymap, mpConfig, mpStorymaps,
  helpers, tApplication, tFallback, dStorymap
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
      }, 800);
    },

    // Build story map
    build: function() {
      var thisApp = this;

      // Replace image paths and parse JSON
      dStorymap = dStorymap.replace(/\[\[\[IMAGE_PATH\]\]\]/g, this.options.paths.images);
      this.slides = JSON.parse(dStorymap);

      // StoryMap comes nowhere near running in IE8 (and barely in IE9)
      if (helpers.isMSIE() <= 8 && helpers.isMSIE() > 4) {
        this.$('.content-container').html(_.template(tFallback, this.slides));
        return;
      }

      // Make map
      this.sMap = this.makeStorymap('green-line-story-map', this.slides, true);

      // When map is loaded.  This seems to only happen in landscape view.  :(
      this.sMap._map.on('loaded', function() {

        // Add Geojson green line layer.
        // This could not be done because StoryMap provides a hacked up
        // version of Leaflet with no GeoJSON layer and the even including
        // Leaflet itself cannot get around it

        // Remove loading
        thisApp.$('.initial.loading-block').slideUp('fast');

        // Update display
        thisApp.sMap.updateDisplay();
      });

      // Hack around portrait not trigger loading event, and it turns out
      // even portait can be trigger on bigger screens
      if (this.$('#green-line-story-map').width() <= 675) {
        this.$('.initial.loading-block').slideUp('fast');
      }
      _.delay(function() {
        thisApp.$('.initial.loading-block').slideUp('fast');
      }, 1500);
    },

    // Wrapper around creating a map
    makeStorymap: function(id, data, expand) {
      expand = expand || false;
      var $map = $('#' + id);
      var wWidth = $(window).width();
      var sMap, mapOffset;

      // Expand container to width of window
      if (expand && wWidth > ($map.width() + 30)) {
        mapOffset = $map.offset();
        $map.parent().css('position', 'relative');
        $map
          .css('position', 'relative')
          .css('left', (mapOffset.left * -1) + 'px')
          .width($(window).width())
          .addClass('expanded');
      }

      // Make map
      sMap = new storymap.StoryMap(id, data, {
        map_type: 'https://{s}.tiles.mapbox.com/v3/minnpost.map-wi88b700/{z}/{x}/{y}.png',
        map_subdomains: 'abcd',
        map_mini: false,
        line_color: '#0D57A0',
        line_color_inactive: '#404040',
        line_join: 'miter',
        line_weight: 3,
        line_opacity: 0.90,
        line_dash: '5,5',
        show_lines: true,
        show_history_line: true,
        calculate_zoom: (this.$('#green-line-story-map').width() <= 675)
        //slide_padding_lr: 20,
        //layout: 'landscape',
        //width: '100%'
      });

      // Customize map a bit
      sMap._map.on('loaded', function() {
        this._map.removeControl(this._map.attributionControl);

        // Some styles are manually added
        $map.find('.vco-storyslider .vco-slider-background').attr('style', '');
      });

      // Handle resize
      $(window).on('resize', function(e) {
        _.throttle(function() {
          sMap.updateDisplay();
        }, 400);
      });

      return sMap;
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

