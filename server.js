var debug = require('debug')('api:server');
var app = require('./app');

const HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, () => {
  debug('Ready to handle requests on port ' + HTTP_PORT);
});
