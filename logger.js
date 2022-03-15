const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  exitOnError: false,
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.Console());
} else {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

module.exports = logger;
module.exports.stream = {
  write: function (message) {
    logger.info(message);
  },
};
