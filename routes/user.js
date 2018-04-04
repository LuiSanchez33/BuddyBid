const express = require('express');

var bcrypt = require('bcryptjs');

var app = express();

//const app = express();

var User = require('../models/user');

//===========================
//GET ALL USERS
//===========================

app.get('/', (req, res, next) => {
  User.find({}, 'name email img role')
    .exec(
      (err, user) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            msg: 'Error loading user',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          user: user
        })
      }
    );
});

//===========================
//CREATE NEW USER
//===========================

app.post('/', (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    img: req.body.img,
    role: req.body.role
  });

  user.save((err, userSaved) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        msg: 'Failed to add user',
        errors: err
      });
    }
    else {
      res.status(201).json({
        ok: true,
        user: userSaved
      })
    }
  });
});

//===========================
//Update User
//===========================

app.put('/:id', (req, res) => {
  var id = req.params.id;
  var body = req.body;

  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error in searching user',
        errors: err
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'User not exits with this id: ' + id,
        errors: { message: 'Doesnt exits this user' }
      })
    }

    user.name = body.name;
    user.email = body.email;
    user.role = body.role;

    user.save((err, userSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'error when updating user',
          errors: err
        });
      }

      userSaved.password = ':)';

      res.status(201).json({
        ok: true,
        user: userSaved
      });

    });

  });



});

//===========================
//Delete User
//===========================

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, userDeleted) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'error erasing user',
        errors: err
      });
    }

    if (!userDeleted) {
      return res.status(400).json({
        ok: false,
        message: 'doesnt exist user with this id: ' + id,
        errors: { message: 'doesnt exist user with this id: ' }
      })
    }

    res.status(200).json({
      ok: true,
      user: userDeleted
    });
  })
})

module.exports = app;