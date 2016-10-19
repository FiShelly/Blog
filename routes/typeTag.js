'use strict';
var express = require('express');
var crypto = require('crypto');
var moment = require("moment");
var router = express.Router();
var TypeTag = require('../models/TypeTag.js');
/* GET users listing. */

function checkLogin(req, res, next) {
    if (!req.session.user) {
        res.json({status:'-2'});
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
            res.json({status: '1', typetag: typetag});
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
            res.json({status: '1'});
        }
    });
});

//router.post('/updateCounut', checkLogin);
router.post('/updateCounut', function (req, res, next) {

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
            res.json({status: '1'});
        }
    });
});
//router.post('/page/:page', checkLogin);
router.post('/page/:page/:size', function (req, res, next) {
    console.log("enter page type tag");
    TypeTag.getTypeTagByPage(req.body.type,req.params.page,req.params.size, function (err,typetags,total,size) {
        if (err) {
            console.log(err);
            console.log("the server has error ");
            res.json({status: '0'});
        } else {
            res.json({status: '1',typetags:typetags,total:total,size:size});
        }

    });
});
module.exports = router;
