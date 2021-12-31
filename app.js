require('dotenv').config();

const debug = require('debug')('api:app');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const accounts = require('./controllers-cache/account');
const rooms = require('./controllers-cache/room');
const chats = require('./controllers-cache/chat');
const jwt = require('./utils/jwt');

const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (typeof header == 'undefined' || header == null) {
    res.status(403).json({
      message: `invalid header`,
    });
  } else {
    const bearer = header.split(' ');
    const token = bearer[1];

    jwt
      .verify(token)
      .then((decoded) => {
        res.locals.decoded = decoded;
        next();
      })
      .catch((err) => {
        res.status(403).json({
          message: err,
        });
      });
  }
};

app.get('/', (req, res) => {
  debug('visiting root');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/account/register', async (req, res) => {
  debug('registering an account');
  accounts
    .validateRegister(req.body)
    .then((data) => {
      accounts
        .registerAccount(data)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(404).json({
            message: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
});

app.post('/account/login', async (req, res) => {
  debug('login with an account');
  accounts
    .validateLogin(req.body)
    .then((data) => {
      accounts
        .verifyAccount(data)
        .then((result) => {
          debug(result);
          req.body.id = result.id;

          jwt
            .sign(req.body)
            .then((token) => {
              res.json({ token: token });
            })
            .catch((err) => {
              res.status(404).json({
                message: err,
              });
            });
        })
        .catch((err) =>
          res.status(404).json({
            message: err,
          })
        );
    })
    .catch((err) =>
      res.status(404).json({
        message: err,
      })
    );
});

app.post('/room/create', checkToken, async (req, res) => {
  debug('creating a room');
  rooms
    .validateCreate(req.body)
    .then((data) => {
      rooms
        .createRoom(data)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(404).json({
            message: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
});

app.post('/room/:room_id', checkToken, async (req, res) => {
  debug('entering a room');

  if (req.params.room_id !== req.body.id) {
    res.status(404).json({
      message: 'mismatch room id in params and req body',
    });
    return;
  }

  rooms
    .validateEntry(req.body)
    .then((data) => {
      rooms
        .verifyEntry(data)
        .then((result) => {
          rooms
            .isRoomAvailable(roomId)
            .then((result) => {
              if (!result) {
                res.status(404).json({
                  message: `room ${req.params.room_id} is full`,
                });
                return;
              }
              rooms
                .enterRoom(account_id, req.body.id)
                .then((result) => {
                  res.json(result);
                })
                .catch((err) => {
                  res.status(404).json({
                    message: err,
                  });
                });
            })
            .catch((err) => {
              res.status(404).json({
                message: err,
              });
            });
        })
        .catch((err) => {
          res.status(404).json({
            message: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
});

app.get('/room/:room_id', checkToken, async (req, res) => {
  debug('getting all the chats from a room');
  rooms
    .getRoomId(account)
    .then((result) => {
      if (result) {
        chats
          .getChatsInRoom(req.params.room_id)
          .then((data) => {
            res.json({ chats: data });
          })
          .catch((err) => {
            res.status(404).json({
              message: err,
            });
          });
      } else {
        res.status(404).json({
          message: `user is currently not in room ${req.params.room_id}`,
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
});

app.put('/room/:room_id', checkToken, async (req, res) => {
  debug('leaving a room');
  rooms
    .leaveRoom(account)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({
        message: err,
      });
    });
});

app.use((req, res) => {
  debug('visiting non existing resource');
  res.status(404).send('Resource not found');
});

module.exports = app;
