var pkgJson = require('./package.json')
  , appOptions;

appOptions = {
  appName : pkgJson.name,
  appTitle: pkgJson.description,
  appPort : parseInt(process.env.PORT, 10),    // mandatory env var
};

require('./server/src/app').init(appOptions);
