const debug = require('debug')('api:controllers-db:account');
const bcrypt = require('bcrypt');
const pool = require('../database/pool');

const ROUNDS = process.env.ROUNDS || 10;

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
          if (!result) {
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
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
