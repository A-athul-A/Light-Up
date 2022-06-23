var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
  

  ]
  
  res.render('index', {products,admin:false});
});

module.exports = router;
