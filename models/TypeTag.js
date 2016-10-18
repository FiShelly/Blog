/**
 * Created by FiShelly on 2016/10/18.
 */
var mongodb = require('./db');
var settings = require('../settings');
var TypeTag = function (typeTag) {
    this.id = typeTag.id;
    this.type = typeTag.type;
    this.name = typeTag.name;
    this.date = typeTag.date;
    this.count = typeTag.count;
};
module.exports = TypeTag;

TypeTag.save = function (typeTag, callback) {
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.insert(typeTag, {safe: true}, function (err, typeTag) {
                    mongodb.close();
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
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.update({id: typeTag.id}, {
                    $set: {
                        "name": typeTag.name
                    }
                }, function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, typeTag);
                });
            });
        });
    });
};

TypeTag.updateCount = function (typeTag, callback) {
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.update({id: typeTag.id}, {
                    $set: {
                        "count": typeTag.count
                    }
                }, function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, typeTag);
                });
            });
        });
    });
};

TypeTag.delete = function (typeTag, callback) {
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.remove({id: typeTag.id}, {w: 1}, function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

TypeTag.getTypeTagById = function (id, callback) {
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('typetag', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.findOne({id: id}, function (err, typeTag) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, typeTag);
                });
            });
        });
    });
};

TypeTag.getTypeTagByPage = function (type, page, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection('typetag', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                var query = {type:type};

                collection.count(query, function (err, total) {
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                    collection.find(query, {
                        skip: (page - 1) * 10,
                        limit: 10
                    }).sort({
                        date: -1
                    }).toArray(function (err, docs) {
                        mongodb.close();
                        console.log(docs);
                        if (err) {
                            console.log(err);
                            return callback(err);
                        }
                        callback(null, docs, total);
                    });
                });
            });
        });
    });
};