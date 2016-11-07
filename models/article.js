/**
 * Created by FiShelly on 2016/10/22.
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
var Article = function (article) {
    this.id = article.id;
    this.title = article.title;
    this.type = article.type;
    this.tag = article.tag;
    this.abstract = article.abstract;
    this.date = article.date;
    this.articleHtml = article.articleHtml;
    this.articleMd = article.articleMd;
    this.readCount = 0;
    this.commentCount = 0;
    this.status = article.status;
    //this.nextArticle = article.nextArticle;
    //this.preArticle = article.preArticle;
};

module.exports = Article;

Article.save = function (article, callback) {
    var saveEntry = new Article(article);
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            mongodb.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                collection.insert(saveEntry, {safe: true}, function (err, article) {
                    pool.release(mongodb);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, article.ops[0]);
                });
            });
        });

    });
};


Article.update = function (article, callback) {
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            mongodb.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                collection.update({id: article.id}, {
                    $set: {
                        "name": article.name,
                        "title": article.title,
                        "type": article.type,
                        "tag": article.tag,
                        "abstract": article.abstract,
                        "date": article.date,
                        "articleHtml": article.articleHtml,
                        "status": article.status,
                        "articleMd": article.articleMd
                    }
                }, function (err) {
                    pool.release(mongodb);
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, article);
                });
            });
        });
    });
};

Article.delete = function (id, status, callback) {
    pool.acquire(function (err, mongodb) {
        console.log("update Name mongo");
        mongodb.authenticate(settings.user, settings.pwd, function () {
            mongodb.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                collection.update({id: id}, {
                    $set: {
                        "status": status
                    }
                }, function (err) {
                    pool.release(mongodb);
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

Article.getArticleById = function (id,status, callback) {
    pool.acquire(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.findOne({id: id,status:status}, function (err, article) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, article);
                });
            });
        });
    });
};

Article.getArticleByPage = function (page, ls, callback, status) {
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            mongodb.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                var query = {};
                if (status) {
                    query.status = status;
                }


                collection.count(query, function (err, total) {
                    collection.find(query, {
                        skip: (page - 1) * ls,
                        limit: ls
                    }).sort({
                        date: -1
                    }).toArray(function (err, docs) {
                        pool.release(mongodb);
                        console.log(docs);
                        if (err) {
                            console.log(err);
                            return callback(err);
                        }
                        callback(null, docs);
                    });
                });
            });
        });
    });
};

Article.getArticleByQuery = function (query, callback) {
    console.log(query);
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            mongodb.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }
                collection.find(query,{
                    "id":1,
                    "title":1,
                    "date":1,
                    "type":1
                }).sort({date:-1}).toArray(function(err,docs){
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


Article.updateReadAndCommentCount = function (id,query, callback) {
    console.log(query);
    pool.acquire(function (err, mongodb) {
        mongodb.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            mongodb.collection('articles', function (err, collection) {
                if (err) {
                    pool.release(mongodb);
                    return callback(err);
                }

                collection.update({
                    "id": id
                }, {
                    $inc: query
                }, function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                });
            });
        });
    });
};

