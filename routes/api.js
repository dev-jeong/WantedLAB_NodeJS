var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.db');

router.post('/board/list', function (req, res, next) {
  db.all(`SELECT idx, subject, name, reg_ts, edit_ts
          FROM board
          ORDER BY reg_ts DESC`,
    function (err, row) {
      res.send(row);
    });
});

router.post('/board/search', function (req, res, next) {
  var word = '%' + req.body.word + '%'
  db.all(`SELECT idx, subject, name, reg_ts, edit_ts
          FROM board 
          WHERE subject LIKE ? OR name LIKE ?
          ORDER BY reg_ts DESC`,
    [word, word],
    function (err, row) {
      res.send(row);
    });
});

router.post('/board/read', function (req, res, next) {
  var idx = req.body.idx

  db.all(`SELECT subject, context, name, reg_ts, edit_ts 
          FROM board 
          WHERE idx = ?`,
    [idx],
    function (err, row) {
      res.send(row[0]);
    });
});

router.put('/board/write', function (req, res, next) {
  var subject = req.body.subject
  var context = req.body.context
  var name = req.body.name
  var password = req.body.password

  db.all(`INSERT INTO board (subject, context, name, password, reg_ts) 
          VALUES (?, ?, ?, hex(?), datetime('now','localtime'))`,
    [subject, context, name, password],
    function (err, row) {
      res.send(row);
    });
});

router.post('/board/update', function (req, res, next) {
  var idx = req.body.idx
  var subject = req.body.subject
  var context = req.body.context

  db.all(`UPDATE board 
          SET subject = ?,
          context = ?,
          edit_ts = datetime('now','localtime')
          WHERE idx = ?`,
    [subject, context, idx],
    function (err, row) {
      res.send(row);
    });
});

router.delete('/board/delete', function (req, res, next) {
  var idx = req.body.idx

  db.all(`DELETE FROM board WHERE idx = ?`, [idx], function (err, row) {  });
  db.all(`SELECT idx FROM reply WHERE board_idx = ?`, [idx], function (err, row1) { 
    db.all(`DELETE FROM rereply WHERE replay_idx in ?`, [row1], function (err, row2) { }); 
  });
  db.all(`DELETE FROM reply WHERE board_idx = ?`, [idx], function (err, row) { });
  
  res.send(true)
});

router.post('/board/auth', function (req, res, next) {
  var idx = req.body.idx
  var password = req.body.password

  db.all(`SELECT *
          FROM board
          WHERE idx = ? AND password = hex(?)`,
    [idx, password],
    function (err, row) {
      if (row.length == 0)
        res.send('fail');
      else
        res.send('success');
    });
});

router.post('/reply/list', function (req, res, next) {
  var board_idx = req.body.board_idx

  db.all(`SELECT idx, context, name, reg_ts
          FROM reply 
          WHERE board_idx = ?`,
    [board_idx],
    function (err, row) {
      res.send(row);
    });
});

router.put('/reply/write', function (req, res, next) {
  var board_idx = req.body.board_idx
  var context = req.body.context
  var name = req.body.name

  db.all(`INSERT INTO reply (board_idx, context, name, reg_ts) 
          VALUES (?, ?, ?, datetime('now','localtime'))`,
    [board_idx, context, name],
    function (err, row) {
      res.send(row);
    });
});

router.post('/rereply/list', function (req, res, next) {
  var reply_idx = req.body.reply_idx

  db.all(`SELECT context, name, reg_ts
          FROM rereply 
          WHERE reply_idx = ?`,
    [reply_idx], function (err, row) {
      res.send(row);
    });
});

router.put('/rereply/write', function (req, res, next) {
  var reply_idx = req.body.reply_idx
  var context = req.body.context
  var name = req.body.name

  db.all(`INSERT INTO rereply (reply_idx, context, name, reg_ts) 
          VALUES (?, ?, ?, datetime('now','localtime'))`,
    [reply_idx, context, name],
    function (err, row) {
      res.send(row);
    });
});




module.exports = router;