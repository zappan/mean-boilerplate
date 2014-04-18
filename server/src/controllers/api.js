var repository = require('../data/repository');

// GET :collection list
exports.index = function index(req, res) {
  repository.findAll(req.params.collection, function (err, docs) {
    if (err) { res.json(err, 500); }
    else { res.json(docs); }
  });
};

// GET :collection document by id
exports.read = function read(req, res) {
  repository.findById(req.params.collection, req.params.id, function(err, doc) {
    if (err) { res.json(err, 500); }
    else { res.json(doc); }
  });
};
