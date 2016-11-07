/**
 * Created by FiShelly on 2016/11/6.
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

var Comment = function (comment) {
    this.id=comment.id;
    this.article = comment.article;
    this.content = comment.content;
    this.date = comment.date;
    this.visitor = comment.visitor;
    this.quotes = comment.quotes;
};

module.exports = Comment;

Comment.save = function (comment, callback) {
    var saveEntry = new Comment(comment);
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            mongodb.collection('comments', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                collection.insert(saveEntry, {safe: true}, function (err, comment) {
                    pool.release(mongodb);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, comment.ops[0]);
                });
            });
        });

    });
};

Comment.delete = function (id, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('comments', function (err, collection) {
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

Comment.getCommentByQuery = function (query, callback,flag) {
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            mongodb.collection('comments', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                var obj = {date:1};
                if(flag){
                    obj = {date:-1}
                }
                collection.find(query).sort(obj).toArray(function(err,docs){
                    pool.release(mongodb);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, docs);
                });
            });
        });
    });
};