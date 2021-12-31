const debug = require('debug')('api:controllers:chat');
const Joi = require('joi');
const pool = require('../database/pool');

const chatSchema = Joi.object({
  account_id: Joi.number().integer().required(),
  room_id: Joi.number().integer().required(),
  content: Joi.string().min(1).max(200).required(),
});

module.exports.validateChat = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, chatSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.verifyChat = function (account, chat) {
  return account.id === chat.account_id;
};

module.exports.addChat = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let sql = `INSERT INTO chats (account_id, room_id, content, sendtime) VALUES ('${item.account_id}', '${item.room_id}', '${item.content}', current_timestamp) RETURNING id;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.getRoomChats = function (roomId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let sql = `SELECT * FROM chats WHERE room_id = '${roomId}';`;
      let result = await db.query(sql);
      resolve(result.rows);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
