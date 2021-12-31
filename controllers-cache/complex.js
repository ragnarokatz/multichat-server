const debug = require('debug')('api:controllers-cache:complex');
const rooms = require('./room');
const chats = require('./chat');
const accounts = require('./account');

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    let initAccount = accounts.initialize();
    let initChat = chats.initialize();
    let initRoom = rooms.initialize();

    Promise.all([initAccount, initChat, initRoom])
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.enterRoom = function (username, roomId) {
  return new Promise((resolve, reject) => {
    accounts
      .enterRoom(username, roomId)
      .then(() => {
        rooms
          .enterRoom(username, roomId)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.leaveRoom = function () {
  return new Promise((resolve, reject) => {
    accounts
      .leaveRoom(username)
      .then((roomId) => {
        rooms
          .leaveRoom(username, roomId)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
