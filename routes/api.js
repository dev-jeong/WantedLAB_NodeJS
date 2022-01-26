const async = require('async');
const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

router.post('/board/list', function (req, res, next) {
  var page = req.body.page

  async.waterfall([
    // 게시글의 총 갯수
    function (callback) {
      db.all(
        `SELECT count(*) as count 
         FROM board`,
        function (err, row) {
          callback(null, row[0].count)
        });
    },
    // 게시글 데이터
    function (total, callback) {
      db.all(
        `SELECT idx, subject, name, reg_ts, edit_ts 
         FROM board 
         ORDER BY reg_ts DESC 
         Limit ?, 10`,
        [(page - 1) * 10],
        function (err, row) {
          var result = {}
          result.total_cnt = total;
          result.list = row
          callback(null, result)
        });
    }
  ], function (err, result) {
    res.send(result)
  });
});

router.post('/board/search', function (req, res, next) {
  var page = req.body.page
  var word = '%' + req.body.word + '%'

  async.waterfall([
    // 검색된 게시글의 총 갯수
    function (callback) {
      db.all(
        `SELECT count(*) as count 
         FROM board 
         WHERE subject LIKE ? OR name LIKE ?`,
        [word, word],
        function (err, row) {
          callback(null, row[0].count)
        });
    },
    // 검색된 게시글 데이터
    function (total, callback) {
      db.all(
        `SELECT idx, subject, name, reg_ts, edit_ts 
         FROM board 
         WHERE subject LIKE ? OR name LIKE ? 
         ORDER BY reg_ts 
         DESC Limit ?, 10`,
        [word, word, (page - 1) * 10],
        function (err, row) {
          var result = {}
          result.total_cnt = total;
          result.list = row
          callback(null, result)
        });
    }
  ], function (err, result) {
    res.send(result)
  });
});

router.post('/board/read', function (req, res, next) {
  var idx = req.body.idx

  // 게시글 내용 읽기
  db.all(
    `SELECT subject, context, name, reg_ts, edit_ts 
     FROM board 
     WHERE idx = ?`,
    [idx],
    function (err, row) {
      var result = {}
      if (row.length == 0)
        result.result = false
      else {
        result.result = true
        result.data = row[0]
      }
      res.send(result);
    });
});

router.put('/board/write', function (req, res, next) {
  var subject = req.body.subject
  var context = req.body.context
  var name = req.body.name
  var password = req.body.password

  async.waterfall([
    function (callback) {
      // 게시글 등록 
      db.all(
        `INSERT INTO board (subject, context, name, password, reg_ts) 
        VALUES (?, ?, ?, hex(?), datetime('now','localtime'))`,
        [subject, context, name, password],
        function (err, row) {
          if (err || context === undefined) {
            callback(null, false)
          }
          else {
            callback(null, true)
          }
        });
    },
    // 알람 보내기 - 키워드 리스트 추출
    function (result, callback) {
      if (result) {
        db.all(
          `SELECT * 
           FROM keyword`,
          function (err, row) {
            callback(null, true, row)
          })
      }
      else {
        callback(null, false, null)
      }
    },
    // 알람 보내기 - 메세지 생성
    function (result, data, callback) {
      if (result) {
        data.forEach(function (element) {
          if (context.indexOf(element.keyword) != -1)
            db.all(`INSERT INTO alert VALUES (?, ?, ?)`, [element.name, element.keyword,subject])
        })
        callback(null, true)
      }
      else {
        callback(null, false)
      }
    }
  ], function (err, result) {
    res.send(result)
  });
});

router.post('/board/update', function (req, res, next) {
  var idx = req.body.idx
  var subject = req.body.subject
  var context = req.body.context

  async.waterfall([
    function (callback) {
      // 게시글 수정
      db.all(
        `UPDATE board 
         SET subject = ?, context = ?, edit_ts = datetime('now','localtime')
         WHERE idx = ?`,
        [subject, context, idx],
        function (err, row) {
          if (err || context === undefined) {
            callback(null, false)
          }
          else {
            callback(null, true)
          }
        });
    },
    // 알람 보내기 - 키워드 리스트 추출
    function (result, callback) {
      if (result) {
        db.all(
          `SELECT * 
           FROM keyword`,
          function (err, row) {
            callback(null, true, row)
          })
      }
      else {
        callback(null, false, null)
      }
    },
    // 알람 보내기 - 메세지 생성
    function (result, data, callback) {
      if (result) {
        data.forEach(function (element) {
          if (context.indexOf(element.keyword) != -1)
            db.all(`INSERT INTO alert VALUES (?, ?, ?)`, [element.name, element.keyword, subject])
        })
        callback(null, true)
      }
      else {
        callback(null, false)
      }
    }
  ], function (err, result) {
    res.send(result)
  });
});

router.delete('/board/delete', function (req, res, next) {
  var idx = req.body.idx

  async.waterfall([
    // 게시글 삭제
    function (callback) {
      db.all(
        `DELETE 
         FROM board 
         WHERE idx = ?`,
        [idx],
        function (err, row) {
          if (err) {
            callback(null, false)
          }
          else {
            callback(null, true)
          }
        });
    },
    // 대댓글 삭제
    function (result, callback) {
      if (result) {
        db.all(
          `DELETE 
           FROM rereply 
           WHERE reply_idx in (
            SELECT idx 
            FROM reply 
            WHERE board_idx = ?
          )`,
          [idx],
          function (err, row) {
            if (err) {
              callback(null, false)
            }
            else {
              callback(null, true)
            }
          });
      }
      else {
        callback(null, false)
      }
    },
    // 댓글 삭제
    function (result, callback) {
      if (result) {
        db.all(
          `DELETE 
           FROM reply 
           WHERE board_idx = ?`,
          [idx],
          function (err, row) {
            if (err) {
              callback(null, false)
            }
            else {
              callback(null, true)
            }
          });
      }
      else {
        callback(null, false)
      }
    }
  ], function (err, result) {
    res.send(result)
  });
});

// 삭제, 수정시 필요한 비밀번호 검증
router.post('/board/auth', function (req, res, next) {
  var idx = req.body.idx
  var password = req.body.password

  db.all(
    `SELECT *
     FROM board
     WHERE idx = ? AND password = hex(?)`,
    [idx, password],
    function (err, row) {
      if (row.length == 0)
        res.send(false);
      else
        res.send(true);
    });
});


router.post('/reply/list', function (req, res, next) {
  var board_idx = req.body.board_idx
  var page = req.body.page

  async.waterfall([
    // 댓글의 총 갯수
    function (callback) {
      db.all(
        `SELECT count(*) as count
         FROM reply 
         WHERE board_idx = ?`,
        [board_idx],
        function (err, row) {
          callback(null, row[0].count)
        });
    },
    // 댓글 데이터
    function (total, callback) {
      db.all(
        `SELECT idx, context, name, reg_ts
         FROM reply
         WHERE board_idx = ?
         Limit ?, 10`,
        [board_idx, (page - 1) * 10],
        function (err, row) {
          var result = {}
          result.total_cnt = total;
          result.list = row
          callback(null, result)
        });
    }
  ], function (err, result) {
    res.send(result)
  });
});

router.put('/reply/write', function (req, res, next) {
  var board_idx = req.body.board_idx
  var context = req.body.context
  var name = req.body.name

  db.all(
    `INSERT INTO reply (board_idx, context, name, reg_ts) 
          VALUES (?, ?, ?, datetime('now','localtime'))`,
    [board_idx, context, name],
    function (err, row) {
      res.send(row);
    });
});

router.post('/rereply/list', function (req, res, next) {
  var reply_idx = req.body.reply_idx

  db.all(
    `SELECT context, name, reg_ts
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

router.post('/alert/list', function (req, res, next) {
  var name = req.body.name

  db.all(`SELECT *  
          FROM alert 
          WHERE name = ?`,
    [name], function (err, row) {
      res.send(row);
    });
});

module.exports = router;