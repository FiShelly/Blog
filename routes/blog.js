var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var moment = require("moment");
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('blog-index', {user: req.session.user});
});
function checkLogin(req, res, next) {
    console.log("enter validate login");
    if (!req.session.user) {
        res.json({status: '-2',msg:"�㻹δ��¼�����¼���ٽ��в�����"});
        return;
    }
    next();
}

router.post('/uploadBlogImg', checkLogin);
router.post('/uploadBlogImg', function (req, res, next) {
    var form = new multiparty.Form({uploadDir: '../public/images/blog/'});
    form.parse(req, function (err, fields, files) {
        console.log(files);
        console.log(fields);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            console.log('parse right: ' + err);
            var dstPath = "";
            if (files.data[0].originalFilename) {
                var fileName = files.data[0].originalFilename.split(".")[1];
                dstPath = 'images/blog/' + "blog_" + moment().format("YYYYMMDDHHmmss") + "." + fileName;
                //������Ϊ��ʵ�ļ���
                fs.rename(files.data[0].path, "../public/" + dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                        res.json({success: 1,message:"�ϴ��ɹ�",url:dstPath});
                    }
                });
            }
        }
    });
});

module.exports = router;
