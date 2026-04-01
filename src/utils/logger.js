import { logEventReceived, resetLogEvents } from "../redux/logEvent";

class Logger {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  log(level, message) {
    console.log(level, message);
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
    this.dispatch(logEventReceived({ level, message }));
  }

  clear() {
    console.log("clearing log events");
    this.dispatch(resetLogEvents());
  }
}

export default Logger;
