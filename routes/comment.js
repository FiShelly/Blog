/**
 * Created by FiShelly on 2016/11/6.
 */
'use strict';
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var Comment = require('../models/comment.js');

function checkLogin(req, res, next) {
    if (!req.session.user) {
        res.json({status: '-2',msg:"你还未登录，请登录后再进行操作。"});
        return;
    }
    next();
}

router.post('/save', function (req, res, next) {
    var commentTmp = req.body.comment;
    var md5 = crypto.createHash('md5');
    var id = md5.update(commentTmp.content+commentTmp.date).digest('hex');
    commentTmp.id = id;
    Comment.save(commentTmp, function (err, comment) {
        if (!comment) {
            res.json({status: '0',msg:"留言发表失败"});
        } else {
            res.json({status: '1', comment: comment,msg:"留言发表成功"});
        }
    });
});

router.post('/delete/:id', checkLogin);
router.post('/delete/:id', function (req, res, next) {
    Comment.delete(req.params.id, function (err) {
        if (err) {
            res.json({status: '0'});
        } else {
            res.json({status: '1',msg:'删除留言成功'});
        }
    });
});

router.post('/page/query', function (req, res, next) {
    Comment.getCommentByQuery(req.body.query, function (err, comments) {
        if (err) {
            res.json({status: '0'});
        } else {
            res.json({status: '1', comments: comments});
        }

    },req.body.flag);

});

module.exports = router;