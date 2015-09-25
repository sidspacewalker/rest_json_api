/*
This is where the URIs are routed to the correct resources
GET, PUT, POST & DELETE Http requests are currently handled.
 */

var express = require('express');
var router = express.Router();


/* GET all the songs in the library */
router.get('/songs', function(req, res) {
  req.db.all('SELECT * FROM library',function (err, rows) {
    if (err) res.json(err);
    else if (rows === undefined) res.json({'code':'DATABASE_IS_EMPTY'});
    else  res.json(rows);
  });
});

/* GET the song from the library */
router.get('/songs/:id', function(req, res) {
  req.db.get('SELECT * FROM library WHERE Id =' + req.params.id, function (err, row) {
    if (err) res.json(err);
    else if (row === undefined) res.json({'code':'RECORD_NOT_FOUND'});
    else  res.json(row);
  });
});

/* POST (Add) a new song to the library */
router.post('/songs', function (req, res) {
  var data = req.body;
  var query = "INSERT INTO library VALUES("+data.Id+",'"+data.Title+"','"+data.Artist+"','"+data.Genre+"','"+data.Notes+"')";

  req.db.run(query, function (err) {
    if (err) res.json(err);
    else {
      req.db.get('SELECT * FROM library WHERE Id =' + data.Id, function (err, row) {
        res.json(row);
      });
    }
  });
});

/* PUT (Update) this song in the library */
router.put('/songs/:id', function (req, res) {
  var data = req.body;
  var query = "UPDATE library SET Title='"+data.Title+"', Artist='"+data.Artist+"', Genre='"+data.Genre+"', Notes='"+data.Notes+"' WHERE Id=" +req.params.id;


  console.log('Error' + JSON.stringify(data));
  req.db.run(query, function (err) {
    if (err) res.json(err);
    else {
      req.db.get('SELECT * FROM library WHERE Id =' + data.Id, function (err, row) {
        res.json(row);
      });
    }
  });
});

/* DELTE this song from the library */
router.delete('/songs/:id', function (req, res) {
  var query = "DELETE from library WHERE Id="+req.params.id;

  req.db.run(query, function (err) {
    if (err) res.json(err);
    else res.json({'deleteSuccess': true});
  });
});

module.exports = router;
