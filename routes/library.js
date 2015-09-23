var express = require('express');
var router = express.Router();


/* GET all the songs in the library */
router.get('/songs', function(req, res) {
  req.db.all('SELECT * FROM library',function (err, rows) {
    res.json(rows);
  });
});


module.exports = router;
