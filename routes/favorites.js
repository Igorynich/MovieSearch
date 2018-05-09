const express = require('express');
const router = express.Router();
const db = require('../db');


/* GET users listing. */
router.post('/', function (req, res, next) {
  const queryC = {
    text: 'SELECT imdbID, Poster, Title, Year, user_name FROM favoritemovies WHERE imdbID = $1 AND user_name = $2',
    values: [req.body.imdbID, req.body.user_name],
    //rowMode:'array'
  };
  const query = {
    text: 'INSERT INTO favoritemovies(imdbID, Poster, Title, Year, user_name) VALUES($1, $2, $3, $4, $5)',
    values: [req.body.imdbID, req.body.Poster, req.body.Title, req.body.Year, req.body.user_name],
    //rowMode:'array'
  };

  db.query(queryC, (err, result) => {
    if (result.rows.length == 0) {
      db.query(query, function (err, result) {
        console.log(err, result);
        if (err) {
          return next(err)
        }
        res.json(req.body);
        console.log(result.rows[0])
      });
    } else {
      res.json('');
    }
  });

});

router.get('/:username', function (req, res, next) {
  const query = {
    text: 'SELECT imdbID, Poster, Title, Year, user_name FROM favoritemovies WHERE user_name = $1',
    values: [req.params.username],
    //rowMode:'array'
  };

  db.query(query, function (err, result) {
    console.log(err, result);
    if (err) {
      return next(err)
    }

    res.json(result.rows);
  });
});

router.delete('/:username/:movie_id', (req, res, next) => {
  const query = {
    text: 'DELETE FROM favoritemovies WHERE user_name = $1 AND imdbID = $2',
    values: [req.params.username, req.params.movie_id],
    //rowMode:'array'
  };
  db.query(query, function (err, result) {
    console.log(err, result);
    if (err) {
      return next(err)
    }

    res.json(result.rows);
  });
});

module.exports = router;
