/**
 * Created by FiShelly on 2016/10/16.
 */

var mongodb = require('./db');
var settings = require('../settings');
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
    mongodb.open(function(err,db){

        db.authenticate(settings.user,settings.pwd ,function(){
            //callback(err, db);
            db.collection('users',function(err,collection){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                if(isUpdate){
                    console.log(user);
                    collection.update({loginId:user.loginId},{$set:{
                        "name":user.name,
                        "position":user.position,
                        "signature":user.signature,
                        "label":user.label,
                        "introduce":user.introduce,
                        "headImg":user.headImg
                    }},function(err){
                        mongodb.close();
                        if(err){
                            return callback(err,null);
                        }
                        callback(null,user);
                    });
                } else {
                    collection.insert(user,{safe:true},function(err,user){
                        mongodb.close();
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
    mongodb.open(function(err,db){
        db.authenticate(settings.user,settings.pwd ,function(){
            db.collection('users',function(err,collection){
                collection.update({"loginId":loginId},{$set:{"password":pwd}},function(err){
                    mongodb.close();
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
    mongodb.open(function(err,db){
        db.authenticate(settings.user,settings.pwd ,function(){
            db.collection('users',function(err,collection){
                collection.update({"loginId":loginId},{$set:{"headImg":headImg}},function(err){
                    mongodb.close();
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
    mongodb.open(function(err, db) {

        db.authenticate(settings.user,settings.pwd ,function(){
            db.collection('users', function(err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                collection.findOne({ loginId: loginId }, function(err, user) {
                    console.log("loginId"+loginId);
                    console.log(user);
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, user);
                });
            });
        });
    });
};