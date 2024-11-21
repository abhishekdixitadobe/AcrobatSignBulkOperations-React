const winston = require("winston");
const _sessionLogs = new Map();
let eventId = 1;

const _logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ level, message, sessionId, timestamp }) => {
      return `${timestamp} [${level}] [${sessionId}]: ${JSON.stringify(
        message
      )}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

function log(sessionId, level, message) {
  _logger.log({
    level: level,
    message: message,
    sessionId: sessionId,
  });
  const sessionLog = _sessionLogs.get(sessionId) || [];
  //if message is a string, convert it to an object
  if (typeof message === "string") {
    message = {
      Action: message,
      Method: "",
      URL: "",
      Request: "",
      Response: "",
      Status: "",
    };
  }
  sessionLog.push({ id: eventId++, message: message });
  _sessionLogs.set(sessionId, sessionLog);
}

function clearLog(sessionId) {
  _sessionLogs.delete(sessionId);
}

function getLog(sessionId) {
  return _sessionLogs.get(sessionId);
}

function deleteLogEventsBeforeId (sessionId, id) {
  const sessionLog = _sessionLogs.get(sessionId) || [];
  const newLog = sessionLog.filter((log) => log.id > id);
  _sessionLogs.set(sessionId, newLog);
}

module.exports = { log, clearLog, getLog, deleteLogEventsBeforeId };
