const debug = require('debug')('api:controllers-cache:account');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const db = require('../controllers-db/account');

const registerSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(4)
    .max(16)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
  confirmPassword: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(4)
    .max(16)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
});

accounts = {};

module.exports.validateRegister = function (item) {
  return new Promise((resolve, reject) => {
    try {
      let result = Joi.attempt(item, registerSchema);
      if (item.password === item.confirmPassword) {
        resolve(result);
      } else {
        let message = 'password does not match confirm password';
        debug(message);
        throw new Error(message);
      }
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.validateLogin = function (item) {
  return new Promise((resolve, reject) => {
    try {
      let result = Joi.attempt(item, loginSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

module.exports.registerAccount = function (item) {
  return new Promise((resolve, reject) => {
    db.registerAccount(item)
      .then((id) => {
        resolve(id);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.verifyAccount = function (item) {
  return new Promise((resolve, reject) => {
    if (item.username in this.accounts) {
      // if in cache
      let account = accounts[item.username];
      bcrypt
        .compare(item.password, account.passhash)
        .then((result) => {
          if (result) {
            resolve(account);
          } else {
            let message = 'incorrect password';
            debug(message);
            reject({ message: message });
          }
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
      return;
    }

    // otherwise look for it in db
    db.verifyAccount(item)
      .then((account) => {
        // add to cache
        account.room_id = null;
        this.accounts[account.username] = account;
        resolve(account);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.enterRoom = function (username, roomId) {
  return new Promise((resolve, reject) => {
    if (!username in this.accounts) {
      let message = `user ${username} is not logged on`;
      debug(message);
      reject({ message: message });
      return;
    }

    let account = this.accounts[username];
    if (account.room_id != null) {
      let message = `user ${username} is already in room ${room_id}`;
      debug(message);
      reject({ message: message });
      return;
    }

    account.room_id = roomId;
    resolve();
  });
};

module.exports.leaveRoom = function (username) {
  return new Promise((resolve, reject) => {
    if (!username in this.accounts) {
      let message = `user ${username} is not logged on`;
      debug(message);
      reject({ message: message });
      return;
    }

    let account = this.accounts[username];
    if (account.room_id == null) {
      let message = `user ${username} is not in any room`;
      debug(message);
      reject({ message: message });
      return;
    }

    let roomId = account.room_id;
    account.room_id = null;
    resolve(roomId);
  });
};

module.exports.isInRoom = function (username, roomId) {
  return new Promise((resolve, reject) => {
    if (!username in this.accounts) {
      let message = `user ${username} is not logged on`;
      debug(message);
      reject({ message: message });
      return;
    }

    let account = this.accounts[username];
    if (account.room_id != roomId) {
      let message = `user ${username} is not in room ${roomId}`;
      debug(message);
      reject({ message: message });
      return;
    }

    resolve();
  });
};
