const debug = require('debug')('api:utils:jwt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secret';

module.exports.verify = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        debug(err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports.sign = function (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: '5m', algorithm: 'HS256' }, (err, token) => {
      if (err) {
        debug(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
