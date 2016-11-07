/**
 * Created by FiShelly on 2016/10/23.
 */
'use strict';
var express = require('express');
var crypto = require('crypto');
var moment = require("moment");
var router = express.Router();
var Article = require('../models/article.js');
/* GET users listing. */

function checkLogin(req, res, next) {
    console.log("enter validate login");
    if (!req.session.user) {
        res.json({status: '-2',msg:"你还未登录，请登录后再进行操作。"});
        return;
    }
    next();
}
router.post('/save', checkLogin);
router.post('/save', function (req, res, next) {
    var articleTmp = req.body.article;
    var md5 = crypto.createHash('md5');
    var id = md5.update(articleTmp.title).digest('hex');
    articleTmp.id = id;
    var msg = '';
    if(req.body.article.status == 2){
        msg = '发布成功！';
    } else if(req.body.article.status == 1){
        msg = '成功保存为草稿！';
    } else{
        msg = '删除成功';
    }
    Article.save(articleTmp, function (err, article) {
        if (!article) {
            console.log("save failed");
            res.json({status: '0'});
        } else {
            console.log("save success");
            res.json({status: '1', article: article,msg:msg});
        }
    });
});

router.post('/updateName', checkLogin);
router.post('/update', function (req, res, next) {
    var msg = '';
    if(req.body.article.status == 2){
        msg = '发布成功！';
    } else if(req.body.article.status == 1){
        msg = '成功保存为草稿！';
    } else{
        msg = '删除成功';
    }
    Article.update(req.body.article, function (err) {
        if (err) {
            console.log("update failed");
            res.json({status: '0'});
        } else {
            console.log("update success");
            res.json({status: '1',msg:msg,article:req.body.article});
        }
    });
});

//
//router.post('/updateNPA', function (req, res, next) {
//    Article.getArticleByQuery(req.body.obj, function (err) {
//        if (err) {
//            console.log("the server has error " + req.body.type);
//            res.json({status: '0'});
//        } else {
//            res.json({status: '1'});
//        }
//
//    });
//});

router.post('/updateName', checkLogin);
router.post('/delete', function (req, res, next) {
    Article.delete(req.body.id,req.body.status, function (err) {
        if (err) {
            console.log("delete failed");
            res.json({status: '0'});
        } else {
            console.log("delete success");
            res.json({status: '1',msg:'删除成功'});
        }
    });
});

router.post('/page/:page/:size', checkLogin);
router.post('/page/:page/:size', function (req, res, next) {
    Article.getArticleByPage(req.params.page, req.params.size, function (err, articles) {
        if (err) {
            console.log(err);
            console.log("the server has error " + req.body.type);
            res.json({status: '0'});
        } else {
            res.json({status: '1', articles: articles});
        }

    });
});

router.post('/page/index/:page/:size', function (req, res, next) {
    Article.getArticleByPage(req.params.page, req.params.size, function (err, articles) {
        if (err) {
            console.log(err);
            console.log("the server has error " + req.body.type);
            res.json({status: '0'});
        } else {
            res.json({status: '1', articles: articles});
        }

    },2);
});

router.post('/getById/:id/:status', function (req, res, next) {
    Article.getArticleById(req.params.id,parseInt(req.params.status), function (err, article) {
        if (err) {
            console.log(err);
            console.log("the server has error ");
            res.json({status: '0'});
        } else if (article == null) {
            res.json({status: '2'});
        } else {
            res.json({status: '1', article: article});
        }
    });
});

router.post('/page/query', function (req, res, next) {
    Article.getArticleByQuery(req.body.query, function (err, articles) {

        if (err) {
            console.log(err);
            console.log("the server has error " + req.body.type);
            res.json({status: '0'});
        } else {
            res.json({status: '1', articles: articles});
        }

    });

});

router.post('/updateCount/:id', function (req, res, next) {
    Article.updateReadAndCommentCount(req.params.id,req.body.query, function (err) {
        console.log(req.body.query);
        if (err) {
            console.log("the server has error " + req.body.type);
            res.json({status: '0'});
        } else {
            res.json({status: '1'});
        }
    });

});
module.exports = router;
