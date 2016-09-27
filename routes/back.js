var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/personal', function(req, res, next) {
  res.render('Back/back-personal', { title: 'Express' });
});

module.exports = router;
