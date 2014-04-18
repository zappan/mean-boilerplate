var Db          = require('./db')
  , db          = Db.db
  , getObjectId = Db.ObjectId;

// findAll
exports.findAll = function findAll (collection, callback) {
  db[collection].find({}, callback);
};

// findById
exports.findById = function findById (collection, id, callback) {
  db[collection].findOne({ _id : getObjectId(id) }, callback);
};
