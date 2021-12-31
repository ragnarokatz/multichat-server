const debug = require('debug')('api:controllers-db:chat');
const pool = require('../database/pool');

module.exports.addChat = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let sql = `INSERT INTO chats (username, room_id, content, sendtime) VALUES ('${item.username}', '${item.room_id}', '${item.content}', current_timestamp) RETURNING id;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.getChatsInRoom = function (roomId) {
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
