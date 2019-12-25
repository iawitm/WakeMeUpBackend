const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ login: req.body.login })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Login exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              login: req.body.login,
              password: hash,
              pictureURL: req.body.pictureURL
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ login: req.body.login })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              login: user[0].login,
              userId: user[0]._id
            },
            "secret"
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            login: user[0].login,
            pictureURL: user[0].pictureURL,
            id: user[0]._id
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.getUserFriends = (req, res, next) => {
  User.findOne({ _id: req.userData.userId })
      .populate('friends', ['_id', 'login', 'pictureURL'])
      .exec()
      .then(user => {
          res.status(200).json(user.friends);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
          error: err
        });
    });
}

exports.deleteFriend = async (req, res) => {
  try {
    await User.updateOne( { _id: req.userData.userId }, { $pull: {friends: req.query.friendId}} );
    await User.updateOne( { _id: req.query.friendId }, { $pull: {friends: req.userData.userId}} );
    res.status(200).json({message: "Friend deleted"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}
