MEAN Boilerplate
================

MEAN stack boilerplate with build procedures in place.


## Goals

This MEAN stack boilerplate offers to be a starting point for new projects,
with the following goals:

* Separated server-side and client-side source files within the same repository
* Build process for client-side code supporting the following two scenarios:
  * application and assets compiled into a `build/dist/` directory to put on a CDN
  * application and assets compiled to `server/public/` to be served by Express
* Separate build chains for:
  * _development_ - all client-side source files served directly as source files
    for easier locating of errors in development, and immediate availability of
    source code changes in the browser, because no need for a watcher to run a
    build (unless new files added, or shell HTML changed which requires a rebuild)
  * _debug_ - all client-side source files concatenated, but not minified, to
    verify the build and reduce latency, while keeping the ability to track the
    source code and errors where they occurred in the source (testing deployment)
  * _release_ - all client-side source files concatenated and minified to increase
    download speed and minimize bandwidth use (staging/production deployment)
* Automatic pick-up of source code changes in development mode
* Automatic cache-busting of compiled client-side JS and CSS in _debug_ and
  _release_ mode


All these requirements were identified through experience on past projects,
and now extracted into this boilerplate. Although this is not the first MEAN
boilerplate out there, it tries to offer all things above combined together
as its unique value.


## Out of the Box configured features:

* Configured Express 4.0 app with routing, controllers and MongoDB data access
* Wired-up Angular application initialization, data fetching functionality,
  and serving the homepage as a starting point for further development
* LESS wired-up as a CSS preprocessor
  ([Why not SASS?](docs/TechnicalDetails.md#choosing-less-over-sass))
* Build automation
* Server-side and client-side BDD style testing wired-up and chained into
  build automation
* Modular approach to Angular application structuring, based on ideas from
  the following articles:
  [[1](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript),
  [2](http://www.artandlogic.com/blog/2013/05/ive-been-doing-it-wrong-part-1-of-3/),
  [3](https://medium.com/opinionated-angularjs/9f01b594bf06),
  [4](http://henriquat.re/modularizing-angularjs/modularizing-angular-applications/modularizing-angular-applications.html)]
* MongoDB passthrough API:
  * access data through direct routes to MongoDB collections mapping to
    kick-start your development
* Single Page Applications (SPA) support:
  * serving the application shell for `text/html` requests
  * serving JSON API data for `application/json` requests
  * through filtering requests by type, we're allowing the application and the
    API to share the same URLs with transparent serving of the proper content
* JSON API inspection from the browser through request type override
  * use `?format=json` query string parameter to fetch the API data in the browser
* Automatic client-side app rebuild through a watcher on new or deleted source
  files or vendor libs, or application shell HTML changes


## Prerequisites

Boilerplate expects that you have the necessary platforms and tools installed
(Git, Node.js, MongoDB). It also expect some global npm modules to be present
on the system, so if you don't have them already, install the following:

    $ sudo npm install -g grunt-cli bower phantomjs


## Getting Started

After picking up the boilerplate as a base for your new project,
run the following to pull all dependencies:

    $ npm install
    $ bower install

Now that you have dependencies installed, you may run your first
build and do the project test-run (Linux and Mac; Windows users
[see here](docs/TechnicalDetails.md#getting-started-for-windows-users)):

    $ grunt
    $ ./dev

If everything went well, you should have boilerplate project up and running,
i.e. Express app listening on port 3000 serving your Angular app.

Additionally, running in _development_ mode is configured to automatically
refresh (restart) Express app on any source code changes, while changes
to the client-side code are automatically picked up on browser refresh,
as server is serving `client/src/` content directly (as it's symlinked).


## Grunt Build Chains

* `$ grunt dev`     - development build - also a default task `$ grunt`
* `$ grunt debug`   - debug build.
* `$ grunt release` - production build

Results of _debug_ and _release_ builds are compiled client-side assets that are
put in `build/dist/` directory, and also copied to `server/public/` for Express app.

That allows the flexibility of CI and deployment automation, which may publish
assets to CDN and use reverse proxy (or some other method) for serving those
static files without actually hitting the Express app, with having Express app
ready to serve those assets as well.


#### Additional Grunt Tasks

By default, _dev_ build chain runs tests on every change. Client-side tests are
run using [PhantomJS](http://phantomjs.org/) headles browser, and server-side
tests are exectued using _MochaTest_ runner, both reporting to console.

Still, some people like to have a GUI browser opened to check the client-side
tests results, or wish to run tests manually. For those, there are the following
tasks defined:

* `$ grunt karma:dev`  - runs client-side tests _continuously_ in Chrome browser
* `$ grunt testClient` - runs client-side tests once using PhantomJS
* `$ grunt testServer` - runs server-side tests once using MochaTest
* `$ grunt testRun`    - runs the above 2 single-run tests combined


## Configuration

To do the basic configuration, check out and adjust the following files:

* `bower.json` - adjust your application name, description, version, author, license, etc.
* `package.json` - adjust your application name, description, version, author, license, etc.
  * `name` - used in bootstrapping the application:
    * server-side part uses it mainly for logging to identify the app
    * client-side part uses it for bootstrapping the app (by `Gruntfile.js` to
      construct `@@appStartCmd` in `/client/src/index.hjs`), and as the main
      namespace for all IIFE modules (so, make sure to update all source files
      namespaces to match the given name).
  * `description` - used as HTML page title
  * `appFilename` - filename that will be given to compiled client-side assets,
    with the respective extension added (`.js`, `.css`, `.min.js`, `.min.css`)
* `scripts/envvars.sh` - configure all application parameters there - port to run
  the Express application on, MongoDB connection string, etc., and add your own
  configuration settings you will use (e.g. Redis, outbound email settings, etc.)
* `client/src/styles/style.less` - adjust application base path relative to a
  domain root, if necessary (empty string if app is served from a domain root)
* `client/src/.jshintrc` - adjust last entry under `globals` to match the app name
  defined in `package.json` (IIFE modules namespace)
* `client/src/**/*.js` - adjust IIFE modules namespace to match the app name
  defined in `package.json`
* `client/test/.jshintrc` - adjust last entry under `globals` to match the app name
  defined in `package.json` (IIFE modules namespace)
* `client/test/**/*.js` - adjust IIFE modules namespace to match the app name
  defined in `package.json`
* `LICENSE` - adjust the license you're using for your project

More technical details can be found in a [separate document](docs/TechnicalDetails.md).


## History


  * **0.2.0** - [2014-04-20] Configured TDD and chained into build automation
  * **0.1.2** - [2014-04-20] Configured Grunt watchers on app shell changes and
    added/removed JS source files and vendor libs
  * **0.1.1** - [2014-04-20] Wired up LESS as a CSS preprocessor
  * **0.1.0** - [2014-04-18] Initial release


## License

This library is licensed under the **MIT License**
