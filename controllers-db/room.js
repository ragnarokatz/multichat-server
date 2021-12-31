const debug = require('debug')('api:controllers-db:room');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const pool = require('../database/pool');

const ROUNDS = process.env.ROUNDS || 10;

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

module.exports.createRoom = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let salt = await bcrypt.genSalt(ROUNDS);
      let passhash = await bcrypt.hash(item.password, salt);
      let sql = `INSERT INTO rooms (roomname, passhash, capacity) VALUES ('${item.roomname}', '${passhash}', '${item.capacity}') RETURNING *;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
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
