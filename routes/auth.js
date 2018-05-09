const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


/* GET users listing. */
/*router.get('/:username', function (req, res, next) {              //Basic auth
  const query = {
    text:'SELECT username, password FROM movieusers WHERE username = $1 AND password = $2',
    values:[req.params.username, req.get('Authorization').slice(6)],
    //rowMode:'array'
  };

  db.query(query, function (err, result) {
    console.log(err, result);
    /!*if (err) {
      return next(err)
    }*!/
    if (result.rows.length==0){
      res.json('');
    } else{
      res.json(result.rows[0]);
    }

    //pool.end();
  });
});*/


/*router.post('/', function (req, res, next) {        //Basic a
  console.log("Body: ", req.body);
  const queryC = {
    text:'SELECT username FROM movieusers WHERE username = $1',
    values:[req.body.username],
    //rowMode:'array'
  };
  const query = {
    text:'INSERT INTO movieusers(username, password) VALUES($1, $2)',
    values:[req.body.username, req.get('Authorization').slice(6) ],
    //rowMode:'array'
  };
  db.query(queryC, (err, result)=>{
    console.log(err, result);
    if (result.rows.length==0){
      db.query(query, function (err, result) {
        console.log(err, result);
        if (err) {
          return next(err)
        }
        res.json(result); //--
        console.log(result.rows[0])
        //pool.end();
      });
    } else {
      res.json('');
    }
  });
});*/

router.post('/', function (req, res, next) {      //authorize

  const queryC = {
    text: 'SELECT username, password FROM movieusers WHERE username = $1',
    values: [req.body.username],
    //rowMode:'array'
  };
  const pass = req.body.password;
  db.query(queryC, (err, result) => {
    console.log(err, result);
    if (result.rows.length > 0) {
      const hash = result.rows[0].password;
      bcrypt.compare(pass, hash, function (err, res1) {

        if (res1 === true) {
          res.json(result.rows[0]);
        } else {
          res.json('');
        }
      });
    } else {
      res.json('');
    }
  });
});

router.post('/regnew', function (req, res, next) {        //Reg new user

  const queryC = {
    text: 'SELECT username FROM movieusers WHERE username = $1',
    values: [req.body.username],
    //rowMode:'array'
  };
  const pass = req.body.password;

  db.query(queryC, (err, result) => {
    console.log(err, result);
    if (result.rows.length == 0) {
      bcrypt.hash(pass, saltRounds, function (err, hash) {
        const query = {
          text: 'INSERT INTO movieusers(username, password) VALUES($1, $2)',
          values: [req.body.username, hash],
          //rowMode:'array'
        };
        db.query(query, function (err, result) {
          console.log(err, result);
          if (err) {
            return next(err)
          }
          res.json(result);
        });
      });
    } else {
      res.json('');
    }
  });
});

module.exports = router;
