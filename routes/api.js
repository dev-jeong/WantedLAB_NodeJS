var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send('hi')
});

module.exports = router;


//insert into board values (1, '제목', '내용', '이름', hex('1q2w3e4r'), datetime('now','localtime'), null)
