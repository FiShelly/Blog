'use strict';
var express = require('express');
var crypto = require('crypto');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var moment = require("moment");
var router = express.Router();
var User = require('../models/user.js');
/* GET users listing. */

router.post('/getAuthor', function (req, res, next) {
    User.get(req.body.loginId, function (err, user) {
        if (user) {
            delete user.password;
            res.json({status: '1', author: user});
        } else {
            res.json({status: '0',msg:'查询失败'});
        }
    });
});

router.post('/login', function (req, res, next) {

    User.get(req.body.loginId, function (err, user) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        if (user && password == user.password) {
            req.session.user = user;
            res.json({status: '1', user: user});
        } else {
            res.json({status: '-1',msg:'账号密码错误,请重新输入。'});
        }
    });
});
function checkLogin(req, res, next) {
    if (!req.session.user) {
        res.json({status: '-2'});
        return;
    }
    next();
}
router.post('/saveOrUpdateUser', checkLogin);
router.post('/saveOrUpdateUser', function (req, res, next) {
    if (req.body.password) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        req.body.user.password = password;
    }
    User.saveOrUpdate(req.body.isUpdate, req.body.user, function (err, user) {
        if (!user) {
            res.json({status: '0'});
        } else {
            res.json({status: '1', user: user,msg:'修改个人信息成功'});
        }
    });
});
router.post('/updatePwd', checkLogin);
router.post('/updatePwd', function (req, res, next) {
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    var oldPw = crypto.createHash('md5').update(req.body.oldPwd).digest('hex');

    if (oldPw == req.session.user.password) {
        User.updatePw(req.body.loginId, password, function (err, user) {
            if (err) {
                res.json({status: '0'});
            } else {
                res.json({status: '1',msg:'修改密码成功'});
            }
        });
    } else {
        res.json({status: '-3'});
    }

});
router.post('/uploadHeadImg', checkLogin);
router.post('/uploadHeadImg', function (req, res, next) {
    var form = new multiparty.Form({uploadDir: '../public/upload/'});
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('parse error: ' + err);
        } else {
            var dstPath = "";
            if (files.headImg[0].originalFilename) {
                var fileName = files.headImg[0].originalFilename.split(".")[1];
                dstPath = 'upload/' + "headImg_" + moment().format("YYYYMMDDHHmmss") + "." + fileName;
                //重命名为真实文件名
                fs.rename(files.headImg[0].path, "../public/" + dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                    } else {
                        User.updateHeadImg(fields.loginId[0], dstPath, function (err) {
                            if (err) {
                                res.json({status: '0'});
                            } else {
                                res.json({status: '1', headImg: dstPath,msg:'修改头像成功'});
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;
