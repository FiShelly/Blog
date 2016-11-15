/**
 * Created by FiShelly on 2016/10/16.
 */

var Db = require('./db');
var settings = require('../settings');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name     : 'mongoPool',
    create   : function(callback) {
        var mongodb = Db();
        mongodb.open(function (err, db) {
            callback(err, db);
        })
    },
    destroy  : function(mongodb) {
        pool.release(db);
    },
    max      : 100,
    min      : 5,
    idleTimeoutMillis : 30000,
    log      : true
});

var User = function(user){
    this.loginId = user.loginId;
    this.name = user.name;
    this.position = user.position;
    this.signature = user.signature;
    this.label = user.label;
    this.introduce = user.introduce;
    this.password = user.password;
    this.headImg = user.headImg;
};

module.exports = User;

User.saveOrUpdate = function(isUpdate,user,callback){
    pool.acquire(function(err,db){

        db.authenticate(settings.user,settings.pwd ,function(){
            //callback(err, db);
            db.collection('users',function(err,collection){
                if(err){
                    pool.release(db);
                    return callback(err);
                }
                if(isUpdate){
                    collection.update({loginId:user.loginId},{$set:{
                        "name":user.name,
                        "position":user.position,
                        "signature":user.signature,
                        "label":user.label,
                        "introduce":user.introduce,
                        "headImg":user.headImg
                    }},function(err){
                        pool.release(db);
                        if(err){
                            return callback(err,null);
                        }
                        callback(null,user);
                    });
                } else {
                    collection.insert(user,{safe:true},function(err,user){
                        pool.release(db);
                        if(err){
                            return callback(err);
                        }
                        callback(null,user.ops[0]);
                    });
                }
            });
        });



    });
};

User.updatePw = function(loginId,pwd,callback){
    pool.acquire(function(err,db){
        db.authenticate(settings.user,settings.pwd ,function(){
            db.collection('users',function(err,collection){
                collection.update({"loginId":loginId},{$set:{"password":pwd}},function(err){
                    pool.release(db);
                    if(err){
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

User.updateHeadImg = function(loginId,headImg,callback){
    pool.acquire(function(err,db){
        db.authenticate(settings.user,settings.pwd ,function(){
            db.collection('users',function(err,collection){
                collection.update({"loginId":loginId},{$set:{"headImg":headImg}},function(err){
                    pool.release(db);
                    if(err){
                        return callback(err);
                    }
                    callback(null);
                });
            });
        });
    });
};

User.get = function(loginId, callback) {
    pool.acquire(function(err, db) {

        db.authenticate(settings.user,settings.pwd ,function(){
            db.collection('users', function(err, collection) {
                if (err) {
                    pool.release(db);
                    return callback(err);
                }
                collection.findOne({ loginId: loginId }, function(err, user) {
                    pool.release(db);
                    if (err) {
                        return callback(err);
                    }
                    callback(null, user);
                });
            });
        });
    });
};