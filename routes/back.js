var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/detail/type', function(req, res, next) {
  res.render('Blog/blog-type-detail', { title: 'Express' });
});
router.get('/article', function(req, res, next) {
  res.render('Blog/blog-article', { title: 'Express' });
});
module.exports = router;
