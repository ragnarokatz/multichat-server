const debug = require('debug')('api:controllers:account');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const pool = require('../database/pool');

const ROUNDS = 10;

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

const tokenSchema = Joi.object({
  token: Joi.string()
    .regex(/^[a-zA-Z0-9.-_]*$/)
    .min(50)
    .max(225)
    .required(),
});

module.exports.validateRegister = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, registerSchema);

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
      result = Joi.attempt(item, loginSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.validateToken = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, tokenSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.registerAccount = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let salt = await bcrypt.genSalt(ROUNDS);
      let passhash = await bcrypt.hash(item.password, salt);
      let sql = `INSERT INTO accounts (username, passhash) VALUES ('${item.username}', '${passhash}') RETURNING id;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.verifyAccount = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let accounts = await db.query(`SELECT * FROM accounts WHERE username = '${item.username}';`);
      if (accounts.rowCount == 0) {
        let err = 'account not found for username ' + item.username;
        reject(err);
      }

      if (accounts.rowCount > 1) {
        let err = 'multiple accounts found for username ' + item.username;
        reject(err);
      }

      let account = accounts.rows[0];
      bcrypt
        .compare(item.password, account.passhash)
        .then((result) => {
          if (result == true) {
            resolve(result);
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
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.enterRoom = function (username, roomId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let sql = `UPDATE accounts SET room_id='${roomId}' WHERE username = '${username}';`;
      let result = await db.query(sql);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.leaveRoom = function (username) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let sql = `UPDATE accounts SET room_id=NULL WHERE username = '${username}';`;
      let result = await db.query(sql);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.getRoomId = function (username) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let roomIds = await db.query(`SELECT room_id FROM accounts WHERE username = '${username}';`);
      if (roomIds.rowCount == 0) {
        let err = 'account not found for username ' + username;
        reject(err);
      }

      if (roomIds.rowCount > 1) {
        let err = 'multiple accounts found for username ' + username;
        reject(err);
      }

      let roomId = roomIds.rows[0];
      resolve(roomId);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.getPeopleCount = function (roomId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let count = await db.query(`SELECT COUNT(*) FROM accounts WHERE room_id = '${roomId}';`);
      resolve(count);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
