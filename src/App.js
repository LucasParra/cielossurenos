import React, { Component, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import "./scss/style.scss";

import AppRouter from "./router/AppRouter";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <AppRouter />
      </React.Suspense>
    </HashRouter>
  );
};

export default App;
