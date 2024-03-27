import * as React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { BrowserRouter as HashRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import "@app/styles/styles.css";

const App: React.FunctionComponent = () => (
  <HashRouter>
    <AppRoutes />
  </HashRouter>
);

export default App;
