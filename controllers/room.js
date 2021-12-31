const debug = require('debug')('api:controllers:room');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const pool = require('../database/pool');

const ROUNDS = 10;

const createSchema = Joi.object({
  roomname: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(4)
    .max(16)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
  capacity: Joi.number().integer().min(2).max(20).required(),
});

const entrySchema = Joi.object({
  id: Joi.number().integer().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
});

module.exports.validateCreate = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, createSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.validateEntry = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, entrySchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.createRoom = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let salt = await bcrypt.genSalt(ROUNDS);
      let passhash = await bcrypt.hash(item.password, salt);
      let sql = `INSERT INTO rooms (roomname, passhash, capacity) VALUES ('${item.roomname}', '${passhash}', '${item.capacity}') RETURNING id;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.verifyEntry = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let rooms = await db.query(`SELECT * FROM rooms WHERE id = '${item.id}';`);
      if (rooms.rowCount == 0) {
        let err = 'room not found for id ' + item.id;
        reject(err);
      }

      if (rooms.rowCount > 1) {
        let err = 'multiple rooms found for id ' + item.id;
        reject(err);
      }

      let room = rooms.rows[0];
      bcrypt
        .compare(item.password, room.passhash)
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

module.exports.closeRoom = function (roomId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let sql = `UPDATE rooms SET active=FALSE WHERE id = '${roomId}';`;
      let result = await db.query(sql);
      resolve(result);
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

module.exports.isRoomAvailable = function (roomId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let result = await db.query(`SELECT active FROM rooms WHERE room_id = '${roomId}';`);
      if (!result) {
        let message = `room ${roomId} is not active`;
        debug(message);
        throw new Error(message);
      }

      let count = await db.query(`SELECT COUNT(*) FROM accounts WHERE room_id = '${roomId}';`);
      let capacity = await db.query(`SELECT capacity FROM rooms WHERE room_id = '${roomId}';`);
      resolve(count < capacity);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.getAllRooms = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let rooms = await db.query(`SELECT * FROM rooms WHERE active = TRUE;`);
      resolve(rooms.rows);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
