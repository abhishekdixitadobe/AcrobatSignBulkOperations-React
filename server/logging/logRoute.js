const express = require("express");
const router = express.Router();
const { getLog, deleteLogEventsBeforeId } = require("./logger");

router.get("/api/log", (req, res) => {
  const sessionId = req.sessionID;
  const sessionLog = getLog(sessionId);

  if (!sessionLog) {
    res.status(404).send("Session not found");
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Get the Last-Event-ID header
  const lastEventId = Number(req.header("Last-Event-ID")) || 0;

  // Delete all log events that have already been sent
  deleteLogEventsBeforeId(sessionId, lastEventId);

  // Send the remaining log events
  for (const log of sessionLog) {
    if (log.id > lastEventId) {
      res.write(`id: ${log.id}\n`);
      res.write(`data: ${JSON.stringify(log)}\n\n`);
    }
  }
  res.end();
});

router.get("/api/log/latest", (req, res) => {
  const sessionId = req.sessionID;
  const sessionLog = getLog(sessionId);

  if (!sessionLog) {
    res.status(404).send("Session not found");
    return;
  }
  const latestLogEvent = sessionLog[sessionLog.length - 1];
  res.json(latestLogEvent);
});

module.exports = router;
