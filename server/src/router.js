var express     = require('express')
  , router      = express.Router()
  , loadModules = require('node-load-modules')
  , controllers;

// ### load all controllers
controllers = loadModules({
  moduleDir      : __dirname + '/controllers',
  skipControllers: ['common']
});

// ### ROUTES DEFINITIONS
// direct API-to-Mongo mapping
router.get('/:collection', controllers.api.index);
router.get('/:collection/:id', controllers.api.read);

// ### Publicly exposed functions from the module
module.exports = router;
