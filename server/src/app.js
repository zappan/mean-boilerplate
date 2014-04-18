var assert          = require('assert')
  , path            = require('path')
  , util            = require('util')
  , express         = require('express')
  , bodyParser      = require('body-parser')
  , errorHandler    = require('errorhandler')
  , favicon         = require('static-favicon')
  , morgan          = require('morgan')
  , winston         = require('winston')
  , ModuleUtil      = require('node-module-util')
  , SpaReqFilter    = require('connect-spa-request-filter')
  , reqTypeOverride = require('connect-request-type-override')
  , router          = require('./router');

// ### Gets app config from passed in options, env vars and local config if available
function _getAppConfig(options) {
  return {
      appTitle: options.appTitle
  };
}

// ### Main application initializer function
function init(options) {
  options = options || {};

  var assertErrFormat = util.format(ModuleUtil.functionPath(__dirname, __filename, init), ' :: Fatal error! Missing parameter: %s')
    , publicPath      = path.normalize(__dirname + '/../public')
    , appConfig       = _getAppConfig(options)
    , app             = express()
    , spaReqFilter
    , server;

  assert(options.appName, util.format(assertErrFormat, 'options.appName'));
  assert(options.appPort, util.format(assertErrFormat, 'options.appPort'));

  spaReqFilter = SpaReqFilter.configure({
    appConfig       : appConfig,
    appData         : {},
    appShell        : { view: 'index', layout: false },
    voidFilterRoutes: ['/logout']
  });

  // ### configure app settings :: exposed key-value pairs set via app.set() or app.enable()
  app.enable('trust proxy');            // allow HTTP request IP mapping behind your reverse proxy (nginx)
  app.set('name', util.format('%s.%s', options.appName, app.settings.env));
  app.set('port', options.appPort);
  app.set('view engine', 'hjs');
  app.set('views', publicPath);         // views location mapped to client-side app generated assets public dir

  // ### configure middleware
  app.use('/assets', express.static(publicPath));
  app.use(favicon());           // path to favicon before routing kicks in
  app.use(bodyParser());        // parses HTTP request body into req.body.vars
  app.use(morgan('dev'));       // express-logger: logs everything that happens after this point in the pipeline
  app.use(reqTypeOverride());   // allows request type override via querystring param
  app.use(spaReqFilter());      // activates interceptor for serving SPA app shell HTML (*after* static middleware)
  // Initialize routes last, after body parser middleware has been initialized
  app.use(router);              // activates routing in the pipeline

  switch (app.settings.env) {
    case 'development':
      app.use(errorHandler({ dumpExceptions: true, showStack: true }));
      break;

    case 'production':
      app.use(errorHandler());
      break;
  }

  // ### Start Express app server
  server = app.listen(app.get('port'), function() {
    var logMsg = util.format('%s application Express server listening on port %d in %s mode'
                              , app.get('name'), app.get('port'), app.settings.env);
    winston.info(logMsg);
  });
}


// ### Publicly exposed functions from the module
module.exports = {
  init: init
};
