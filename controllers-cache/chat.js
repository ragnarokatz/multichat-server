const debug = require('debug')('api:controllers-cache:chat');
const Joi = require('joi');
const db = require('../controllers-db/chat');

const chatSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(4)
    .max(16)
    .required(),
  room_id: Joi.number().integer().required(),
  content: Joi.string().min(1).max(200).required(),
});

module.exports.validateChat = function (item) {
  return new Promise((resolve, reject) => {
    try {
      let result = Joi.attempt(item, chatSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    debug("initialize chat");
    resolve();
  });
};

module.exports.addChat = function (item) {
  return new Promise((resolve, reject) => {
    db.addChat(item)
      .then((id) => {
        resolve(id);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getChatsInRoom = function (roomId) {
  return new Promise((resolve, reject) => {
    db.getChatsInRoom(roomId)
      .then((chats) => {
        resolve(chats);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
