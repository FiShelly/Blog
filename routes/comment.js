/**
 * Created by FiShelly on 2016/11/6.
 */
'use strict';
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var Comment = require('../models/comment.js');

//router.post('/save', checkLogin);
router.post('/save', function (req, res, next) {
    var commentTmp = req.body.comment;
    var md5 = crypto.createHash('md5');
    var id = md5.update(commentTmp.content+commentTmp.date).digest('hex');
    commentTmp.id = id;
    Comment.save(commentTmp, function (err, comment) {
        if (!comment) {
            console.log("save failed");
            res.json({status: '0',msg:"留言发表失败"});
        } else {
            console.log("save success");
            res.json({status: '1', comment: comment,msg:"留言发表成功"});
        }
    });
});


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
    console.log(req.body.query);
    Comment.getCommentByQuery(req.body.query, function (err, comments) {
        if (err) {
            console.log(err);
            console.log("the server has error " + req.body.type);
            res.json({status: '0'});
        } else {
            res.json({status: '1', comments: comments});
        }

    });

});

module.exports = router;