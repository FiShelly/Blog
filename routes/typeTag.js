'use strict';
var express = require('express');
var crypto = require('crypto');
var moment = require("moment");
var router = express.Router();
var TypeTag = require('../models/TypeTag.js');
var Article = require('../models/article.js');
/* GET users listing. */

function checkLogin(req, res, next) {
    if (!req.session.user) {
        res.json({status: '-2'});
        return;
    }
    next();
}
router.post('/save', checkLogin);
router.post('/save', function (req, res, next) {
    var typetagTmp = req.body.typetag;
    var md5 = crypto.createHash('md5');
    var id = md5.update(typetagTmp.name).digest('hex');
    typetagTmp.id = id;
    typetagTmp.count = 0;
    typetagTmp.date = moment().format("YYYY-MM-DD HH:mm:ss");
    TypeTag.save(typetagTmp, function (err, typetag) {
        if (!typetag) {
            res.json({status: '0'});
        } else {
            res.json({status: '1', typetag: typetag,msg:'新增类别/标签成功'});
        }
    });
});

router.post('/updateName', checkLogin);
router.post('/updateName', function (req, res, next) {
    TypeTag.updateName(req.body.typetag, function (err) {
        if (err) {
            res.json({status: '0'});
        } else {
            res.json({status: '1',msg:'更改名称成功'});
        }
    });
});

router.post('/updateCount', checkLogin);
router.post('/updateCount', function (req, res, next) {
    var articleList = null;
    TypeTag.resetCount(function(err){
        Article.getArticleByPage(1,100000,function(err,articles){
            if(!err){
                articleList = articles;
                for(var i = 0;i<articleList.length;i++){
                    var article = articleList[i];
                    updateCount(article.type,true);
                    for(var j = 0;j<article.tag.length;j++){
                        updateCount(article.tag[j].name,false);
                    }
                }
            } else {
                console.log(err);
            }
        });
    });
});

var updateCount = function(name,type){
    TypeTag.updateCount(name,type,function (err) {
    });
};

router.post('/countArticle', function (req, res, next) {
    TypeTag.updateCount(req.body.name,req.body.type,function (err) {
        if (err) {
            res.json({status: '0'});
        } else {
            res.json({status: '1'});
        }
    });
});


router.post('/delete', checkLogin);
router.post('/delete', function (req, res, next) {
    TypeTag.delete(req.body.id, function (err) {
        if (err) {
            res.json({status: '0'});
        } else {
            res.json({status: '1',msg:'删除成功'});
        }
    });
});

router.post('/page/:page/:size', function (req, res, next) {
    TypeTag.getTypeTagByPage(req.body.type, req.params.page, req.params.size, function (err, typetags, total, size) {
        if (err) {
            res.json({status: '0'});
        } else {
            res.json({status: '1', typetags: typetags, total: total, size: size});
        }

    });
});

router.post('/getByName', checkLogin);
router.post('/getByName', function (req, res, next) {
    TypeTag.getTypeTagByName(req.body.name, req.body.type, function (err, typetag) {
        if (err) {
            res.json({status: '0'});
        } else if (typetag == null) {
            res.json({status: '2'});
        } else {
            res.json({status: '1', typetag: typetag,msg:'类别名/标签名已存在，请重新输入！'});
        }

    });
});
module.exports = router;
