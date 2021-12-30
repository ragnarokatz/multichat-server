require('dotenv').config();

const debug = require('debug')('api:app');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const accounts = require('./controllers/account');

app.get('/', (req, res) => {
  debug('visiting root');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/accounts', (req, res) => {
  debug('retrieving all accounts');
  accounts
    .getAllAccounts()
    .then((data) => {
      res.json(data);
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.post('/accounts/add', async (req, res) => {
  debug('adding account');
  accounts
    .validateAccount(req.body)
    .then((data) => {
      accounts
        .addAccount(data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) =>
          res.status(404).json({
            message: error,
          })
        );
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.get('/accounts/:account_id', async (req, res) => {
  debug('getting account with id ' + req.params.account_id);
  accounts
    .getAccount(req.params.account_id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.put('/accounts/:account_id', async (req, res) => {
  debug('updating account with id ' + req.params.account_id);
  accounts
    .validateAccount(req.body)
    .then((data) => {
      accounts
        .updateAccount(req.params.account_id, data)
        .then((result) => {
          res.json(result);
        })
        .catch((error) =>
          res.status(404).json({
            message: error,
          })
        );
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.delete('/accounts/:account_id', async (req, res) => {
  debug('deleting account with id ' + req.params.account_id);
  accounts
    .deleteAccount(req.params.account_id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) =>
      res.status(404).json({
        message: error,
      })
    );
});

app.use((req, res) => {
  debug('visiting non existing resource');
  res.status(404).send('Resource not found');
});

module.exports = app;
