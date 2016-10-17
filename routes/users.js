var express = require('express');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var moment = require("moment");
var router = express.Router();
var User = require('../models/user.js');
/* GET users listing. */
router.post('/getUser/:loginId', function (req, res, next) {
    User.get(req.params.loginId, function (err, user) {
        if (!user) {
            console.log("the user is not exits");
            res.json({status: '0'});
        } else {
            res.json({status: '1', user: user});
        }
    });
});

router.post('/saveOrUpdateUser', function (req, res, next) {
    User.saveOrUpdate(req.body.isUpdate,req.body.user, function (err, user) {
        if (!user) {
            console.log("save failed");
            res.json({status: '0'});
        } else {
            console.log("save success");
            res.json({status: '1', user: user});
        }
    });
});

router.post('/updatePwd', function (req, res, next) {
    User.updatePw(req.body.loginId,req.body.password, function (err, user) {
        if (err) {
            console.log("updatePwd failed");
            res.json({status: '0'});
        } else {
            console.log("updatePwd success");
            res.json({status: '1'});
        }
    });
});

router.post('/uploadHeadImg', function (req, res, next) {
    var form = new multiparty.Form({uploadDir: '../public/upload/'});
    form.parse(req, function (err, fields, files) {
        console.log(files);
        console.log(fields);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse right: ' + err);
            var dstPath = "";
            if (files.headImg[0].originalFilename) {
                var fileName = files.headImg[0].originalFilename.split(".")[1];
                dstPath = 'upload/' + "_" + moment().format("YYYYMMDDHHmmss") + "." + fileName;
                //重命名为真实文件名
                fs.rename(files.headImg[0].path,"../public/"+dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                        User.updateHeadImg(fields.loginId[0],dstPath, function (err) {
                            if (err) {
                                console.log("uplopad faild failed");
                                res.json({status: '0'});
                            } else {
                                console.log("save success");
                                res.json({status: '1', headImg: dstPath});
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;
