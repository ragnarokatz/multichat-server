const debug = require('debug')('api:controllers-cache:room');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const db = require('../controllers-db/room');

const ROUNDS = process.env.ROUNDS || 10;

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

rooms = {};

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

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    db.getAllRooms()
      .then((rooms) => {
        for (room in rooms) {
          room.count = 0;
          this.rooms[room.id] = room;
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.createRoom = function (item) {
  return new Promise((resolve, reject) => {
    db.createRoom(item)
      .then((room) => {
        room.count = 0;
        this.rooms[room.id] = room;
        resolve(room.id);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.closeRoom = function (roomId) {
  return new Promise((resolve, reject) => {
    if (!roomId in this.rooms) {
      let message = `room not found for id ${roomId}`;
      debug(message);
      reject({ message: message });
      return;
    }

    db.closeRoom(roomId)
      .then((result) => {
        let room = this.rooms[roomId];
        room.active = false;
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.verifyEntry = function (item) {
  return new Promise((resolve, reject) => {
    if (!item.id in this.rooms) {
      let message = `room not found for id ${item.id}`;
      debug(message);
      reject({ message: message });
      return;
    }

    let room = this.rooms[item.id];
    if (!room.active) {
      let message = `room ${item.id} is not active`;
      debug(message);
      reject({ message: message });
      return;
    }

    if (room.count >= room.capacity) {
      let message = `room ${item.id} is full`;
      debug(message);
      reject({ message: message });
      return;
    }

    bcrypt
      .compare(item.password, room.passhash)
      .then((result) => {
        if (result) {
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
  });
};

module.exports.enterRoom = function (username, roomId) {
  return new Promise((resolve, reject) => {
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
