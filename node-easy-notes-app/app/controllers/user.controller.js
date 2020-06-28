const Users = require("../models/user.model");
const config = require("../../config/database.config");
const crypto = require("crypto")
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require("jsonwebtoken");
var key = config.secret;



//hash password encryprion

async function encrypt(password) {
  return await bcrypt.hash(password, saltRounds)
}

async function decrypt(encrypted, hash) {
  return await bcrypt.compare(encrypted, hash);
}



//create user...............

exports.createUser = (req, res) => {
  Users.find({ email: req.body.email }, async (err, user) => {
    if (err) {
      res.json({
        status: false,
        statusCode: 404,
        message: "Error while getting user",
        error: err
      });
    } else {
      if (user.length > 0) {
        var user1 = {
          Status: user[0].Status,
          password: user[0].password,
          email: user[0].email,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          isVerify: false
        };
        res.json({
          status: true,
          statusCode: 204,
          message: "Email already in use",
          data: user1
        });
      } else {
        let password = await encrypt(req.body.password);

        let createUser = new Users({
          email: req.body.email,
          password: password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          isVerify: false
        });

        createUser.save(function (err, user) {
          if (err) {
            res.json({
              status: false,
              statusCode: 404,
              message: "User not created ",
              error: err
            });
          } else {
            res.json({
              status: true,
              statusCode: 200,
              message: "User created ",
              data: user
            });
          }
        });
      }
    }
  });
};

//user login...............

exports.userLogin = (req, res) => {
  try {
    Users.find({ email: req.body.email }, async (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "Error while getting user",
          error: err
        });
      } else {
        if (user.length > 0) {
          const password = await decrypt(req.body.password, user[0].password);
          if (password === true) {
            const token = jwt.sign({ email: user[0].email }, key, {
              expiresIn: "8h"
            });
            res.json({
              status: true,
              statusCode: 200,
              message: "user login successfully",
              data: { user: user[0], token }
            });
          } else {
            res.json({
              status: false,
              statusCode: 404,
              message: "You have enter wrong password",
              error: err
            });
          }
        } else {
          res.json({
            status: false,
            statusCode: 404,
            message: "User not found"
          });
        }
      }
    });
  } catch (error) {
    res.status(400).send(error)
  }
}

//get user by email




exports.getUserByEmail = (req, res) => {
  try {
   
    Users.find({ email: req.body.email }, async (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "User not get successfully",
          error: err
        });
      } else {
        if (user.length > 0) {
          res.json({
            status: true,
            statusCode: 200,
            message: "user get successfully",
            data: user
          });
        } else {
          res.json({
            status: true,
            statusCode: 404,
            message: "user not found with this email",
            data: user
          });
        }
      }
    });
  } catch (err) {
    res.json({
      status: false,
      statusCode: 401,
      message: "Unauthorization user",
      data: err
    });
  }
};

//update user...............


exports.updateUser = (req, res) => {
  

  var updatedate = req.body;
  updatedate.date_updated = new Date();
  Users.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "User not update successfully",
          error: err
        });
      } else {
        res.json({
          status: true,
          statusCode: 200,
          message: "User update successfully",
          data: user
        });
      }
    }
  );
};

//delete user...............

exports.deleteUser = function(req, res) {
  Users.findByIdAndRemove(req.userId, function(err) {
    if (err) {
      res.json({
        status: false,
        statusCode: 404,
        message: "User not delete successfully",
        error: err
      });
    } else {
      res.json({
        status: true,
        statusCode: 200,
        message: "User delete successfully"
      });
    }
  });
};

//get user list ............

exports.getAll = (req, res) => {
  Users.findById()
  .then(users => {
      res.send(users);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving notes."
      });
  });
};

//verfy .....token..........

exports.varifyemail = (req, res) => {
 
  var decoded = jwt.verify(req.headers.token, key);
  console.log(req.body.email)
  Users.findOneAndUpdate(
   { email: decoded.email },
    { $set: { isVerify: true } },
    { new: true },
    (err, user) => {
      if (err) {
       
        res.json({
          status: false,
          statusCode: 404,
          message: "User not verify ",
          error: err
        });
      } else {
        if (user) {
          var token = jwt.sign({ email: user.email}, key, {
            expiresIn: "8h"
          });
          res.json({
            status: true,
            statusCode: 200,
            message: "User Verify ",
            token,
            user
          });
        } else {
          res.json({
            status: true,
            statusCode: 404,
            message: "User not verify with this email successfully",
            data: []
          });
        }
      }
    }
  );
};


//reset password..................==================


exports.resetpassword = (req, res) => {
  var password = encrypt(req.body.password);
  
  var decoded = null;
  if (req.headers.token) {
    decoded = jwt.verify(req.headers.token, key);
   // console.log(req.headers.token)
  }
  var email = decoded ? decoded.email : req.body.email;
  //console.log(req.body.email)
  //console.log(decoded)
  Users.findOneAndUpdate(
    { email: email },
    { $set: { password: password } },
    { upsert: true },
    (err, user) => {
      if (err) {
        console.log(err)
        res.json({
          status: false,
          statusCode: 404,
          message: "User not verify email successfully",
          error: err
        });
      } else {
        res.json({
          status: true,
          statusCode: 200,
          message: "Password Changed successfully"
        });
      }
    }
  );
};
