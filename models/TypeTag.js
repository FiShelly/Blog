/**
 * Created by FiShelly on 2016/10/18.
 */
var Db = require('./db');
var settings = require('../settings');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name: 'mongoPool',
    create: function (callback) {
        var mongodb = Db();
        mongodb.open(function (err, db) {
            callback(err, db);
        })
    },
    destroy: function (mongodb) {
        mongodb.close();
    },
    max: 100,
    min: 5,
    idleTimeoutMillis: 30000,
    log: true
});

var TypeTag = function (typeTag) {
    this.id = typeTag.id;
    this.type = typeTag.type;
    this.name = typeTag.name;
    this.date = typeTag.date;
    this.count = typeTag.count;
};
module.exports = TypeTag;

TypeTag.save = function (typeTag, callback) {
    var saveEntry = new TypeTag(typeTag);
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.insert(saveEntry, {safe: true}, function (err, typeTag) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, typeTag.ops[0]);
                });
            });
        });
    });
};

TypeTag.updateName = function (typeTag, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.update({id: typeTag.id}, {
                    $set: {
                        "name": typeTag.name
                    }
                }, function (err) {
                    pool.release(db);
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, typeTag);
                });
            });
        });
    });
};

TypeTag.resetCount = function(callback){
  pool.acquire(function(err,db){
      db.authenticate(settings.user, settings.pwd, function () {
          db.collection('typetag', function (err, collection) {
              if (err) {
                  pool.release(db);
                  return callback(err);
              }
              collection.update({}, {
                  $set: {
                      "count": 0
                  }
              },{multi:true}, function (err) {
                  pool.release(db);
                  if (err) {
                      return callback(err);
                  }
                  callback(null);
              });
          });
      });
  });
};

TypeTag.updateCount = function (name, type, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.update({name: name, type: type}, {
                    $inc: {
                        "count": 1
                    }
                }, function (err) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

TypeTag.delete = function (id, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.remove({id: id}, {w: 1}, function (err) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

TypeTag.getTypeTagByName = function (name, type, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.findOne({name: name, type: type}, function (err, typeTag) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, typeTag);
                });
            });
        });
    });
};

TypeTag.getTypeTagById = function (id, type, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.findOne({id: id, type: type}, function (err, typeTag) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, typeTag);
                });
            });
        });
    });
};

TypeTag.getTypeTagByPage = function (type, page, ls, callback) {
    //打开数据库
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection('typetag', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                var query = {};
                if (typeof(type) == 'boolean') {
                    query = {type: type};
                }

                collection.count(query, function (err, total) {
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                    collection.find(query, {
                        skip: (page - 1) * ls,
                        limit: ls
                    }).sort({
                        date: -1
                    }).toArray(function (err, docs) {
                        pool.release(db);
                        if (err) {
                            return callback(err);
                        }
                        var size = total % ls;
                        if (size == 0) {
                            size = total / ls;
                        } else {
                            size = parseInt(total / ls) + 1;
                        }
                        callback(null, docs, total, size);
                    });
                });
            });
        });
    });
};