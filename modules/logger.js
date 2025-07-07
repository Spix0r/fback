const winston = require("winston");

const logger = (silent = false) => {
  return winston.createLogger({
    level: "info",
    silent: silent,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({ stderrLevels: ["warn"] }),
      new winston.transports.File({ filename: "app.log" }),
    ],
  });
};

module.exports = logger;
