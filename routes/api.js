var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.db');

router.post('/board/list', function(req, res, next) {
  db.all("SELECT subject, name FROM board", function (err, row) {
    res.send(row);
  });
});

router.post('/board/search', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT subject, name FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

router.post('/board/read', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT index, subject, context, name, reg_ts, edit_ts FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

router.put('/board/write', function(req, res, next) {
  var word = req.body.word
  db.all("//insert into board values (1, '제목', '내용', '이름', hex('1q2w3e4r'), datetime('now','localtime'), null)", [word, word], function (err, row) {
    res.send(row);
  });
});

router.put('/board/update', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT index, subject, context, name, reg_ts, edit_ts FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

router.delete('/board/delete', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT index, subject, context, name, reg_ts, edit_ts FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

router.post('/replay/list', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT index, subject, context, name, reg_ts, edit_ts FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

router.put('/replay/write', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT index, subject, context, name, reg_ts, edit_ts FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

router.put('/rereplay/write', function(req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all("SELECT index, subject, context, name, reg_ts, edit_ts FROM board WHERE subject LIKE ? OR name LIKE ?", [word, word], function (err, row) {
    res.send(row);
  });
});

module.exports = router;