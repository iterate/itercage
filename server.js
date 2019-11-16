const express = require('express');
const morgan = require('morgan');
const path = require('path');

require('./setup-firebase');

const routes = require('./routes');
const logger = require('./logger');

const app = express();

app.use(morgan('tiny', {
  skip: req => req.url === '/api/health' || req.url.startsWith('/static') || req.url === '/favicon.ico',
  stream: logger.stream
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (req, res) => {
  res.send('healthy!')
});

app.use('/api', routes);

app.use(express.static(path.join(__dirname, "/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  logger.error(err);

  res.json({
    message: err.message,
  });
});

module.exports = app;
