/**
 * Created by FiShelly on 2016/10/22.
 */
var mongodb = require('./db');
var settings = require('../settings');

var Article = function(article){
    this.id = article.id;
    this.title = article.title;
    this.type = article.type;
    this.tag = article.tag;
    this.abstract = article.abstract;
    this.date =  article.date;
    this.articleHtml = article.articleHtml;
    this.articleMd = article.articleMd;
    this.readCount = article.readCount;
    this.commentCount = article.commentCount;
    this.status = article.status;
};

module.exports = Article;

Article.save = function (article, callback) {
    var saveEntry = new Article(article);
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('articles', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.insert(saveEntry, {safe: true}, function (err, article) {
                    mongodb.close();
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
    mongodb.open(function (err, db) {
        console.log("update Name mongo");
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('articles', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.update({id: article.id}, {
                    $set: {
                        "name": article.name,
                        "title" : article.title,
                        "type" : article.type,
                        "tag" : article.tag,
                        "abstract" : article.abstract,
                        "date" :  article.date,
                        "articleHtml" : article.articleHtml,
                        "status":article.status,
                        "articleMd" : article.articleMd
                    }
                }, function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, article);
                });
            });
        });
    });
};

Article.delete = function (id,status, callback) {
    mongodb.open(function (err, db) {
        console.log("update Name mongo");
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('articles', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.update({id: id}, {
                    $set: {
                        "status":status
                    }
                }, function (err) {
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

Article.getArticleById = function (id ,callback) {
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            db.collection('articles', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.findOne({id:id}, function (err, article) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, article);
                });
            });
        });
    });
};

Article.getArticleByPage = function (page, ls, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        db.authenticate(settings.user, settings.pwd, function () {
            if (err) {
                return callback(err);
            }
            //读取 posts 集合
            db.collection('articles', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                var query = {};

                collection.count(query, function (err, total) {
                    //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                    collection.find(query, {
                        skip: (page - 1) * ls,
                        limit: ls
                    }).sort({
                        date: -1
                    }).toArray(function (err, docs) {
                        mongodb.close();
                        console.log(docs);
                        if (err) {
                            console.log(err);
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