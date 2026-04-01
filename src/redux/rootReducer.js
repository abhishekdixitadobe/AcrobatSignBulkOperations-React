import { combineReducers } from "redux";
import appReducer from "./app";
import apiCallreducer from "./apis";
import navStateReducer from "./navState";
import processApisReducer from "./processApis";
import logEventReducer from "./logEvent";
import downloadURLs from "./downloadURLs";
import authReducer from "./authReducer";
import agreementsReducer from "./agreementsSlice";
import templateReducer from "./templateSlice";
import webFormReducer from "./webformSlice";
import widgetsAgreementsReducer from "./webformAgreementsSlice"
import workflowReducer from "./workflowSlice"

const rootReducer = combineReducers({
  app: appReducer,
  apis: apiCallreducer,
  navState: navStateReducer,
  processApis: processApisReducer,
  logEvent: logEventReducer,
  downloadURLs: downloadURLs,
  auth: authReducer,
  agreements: agreementsReducer,
  templates: templateReducer,
  widgets: webFormReducer,
  widgetsAgreements: widgetsAgreementsReducer,
  workflows: workflowReducer
});

export default rootReducer;
