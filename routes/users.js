var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
/* GET users listing. */
router.post('/getUser/:name', function (req, res, next) {
    User.get(req.params.name, function (err, user) {
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
        console.log(user);
        if (!user) {
            console.log("save failed");
            res.json({status: '0'});
        } else {
            console.log("save success");
            res.json({status: '1', user: user});
        }
    });
});

module.exports = router;
