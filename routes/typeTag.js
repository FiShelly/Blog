'use strict';
var express = require('express');
var crypto = require('crypto');
var moment = require("moment");
var router = express.Router();
var TypeTag = require('../models/TypeTag.js');
/* GET users listing. */

function checkLogin(req, res, next) {
    console.log("enter validate login");
    if (!req.session.user) {
        res.json({status: '-2'});
        return;
    }
    next();
}
//router.post('/save', checkLogin);
router.post('/save', function (req, res, next) {
    var typetagTmp = req.body.typetag;
    var md5 = crypto.createHash('md5');
    var id = md5.update(typetagTmp.name).digest('hex');
    typetagTmp.id = id;
    typetagTmp.count = 0;
    typetagTmp.date = moment().format("YYYY-MM-DD HH:mm:ss");
    TypeTag.save(typetagTmp, function (err, typetag) {
        if (!typetag) {
            console.log("save failed");
            res.json({status: '0'});
        } else {
            console.log("save success");
            res.json({status: '1', typetag: typetag,msg:'新增类别/标签成功'});
        }
    });
});

//router.post('/updateName', checkLogin);
router.post('/updateName', function (req, res, next) {
    console.log("update Name");
    TypeTag.updateName(req.body.typetag, function (err) {
        if (err) {
            console.log("updateName failed");
            res.json({status: '0'});
        } else {
            console.log("updateName success");
            res.json({status: '1',msg:'更改名称成功'});
        }
    });
});

//router.post('/updateCounut', checkLogin);
router.post('/updateCount', function (req, res, next) {
    TypeTag.updateCount(req.body.name,req.body.type,function (err) {
        if (err) {
            console.log(err);
            console.log("updateCount failed");
            res.json({status: '0'});
        } else {
            console.log("updateCount success");
            res.json({status: '1'});
        }
    });
});

//router.post('/delete', checkLogin);
router.post('/delete', function (req, res, next) {
    console.log("delete entry");
    TypeTag.delete(req.body.id, function (err) {
        if (err) {
            console.log("delete failed");
            res.json({status: '0'});
        } else {
            console.log("delete success");
            res.json({status: '1',msg:'删除成功'});
        }
    });
});
//router.post('/page/:page/:size', checkLogin);
router.post('/page/:page/:size', function (req, res, next) {
    console.log("enter page type tag");
    TypeTag.getTypeTagByPage(req.body.type, req.params.page, req.params.size, function (err, typetags, total, size) {
        if (err) {
            console.log(err);
            console.log("the server has error " + req.body.type);
            res.json({status: '0'});
        } else {
            res.json({status: '1', typetags: typetags, total: total, size: size});
        }

    });
});

//router.post('/getByName', checkLogin);
router.post('/getByName', function (req, res, next) {
    console.log("enter getByName type tag");
    TypeTag.getTypeTagByName(req.body.name, req.body.type, function (err, typetag) {
        if (err) {
            console.log(err);
            console.log("the server has error ");
            res.json({status: '0'});
        } else if (typetag == null) {
            res.json({status: '2'});
        } else {
            res.json({status: '1', typetag: typetag,msg:'类别名/标签名已存在，请重新输入！'});
        }

    });
});
module.exports = router;
