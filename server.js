var debug = require('debug')('api:server');
var app = require('./app');

const HTTP_PORT = process.env.PORT || 8080;

app
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      debug('Ready to handle requests on port ' + HTTP_PORT);
    });
  })
  .catch((err) => {
    debug('App has failed to start');
  });
