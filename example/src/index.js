import React from "react";
import ReactDOM from "react-dom";
import BroadcastChannel from 'broadcast-channel';
import { BrowserRouter, Route } from 'react-router-dom';
import { CrossRouterProvider } from 'react-cross-client-router'


import "./index.css";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <CrossRouterProvider
      channel={new BroadcastChannel("react-cross-tab-router")}
      storage={window.sessionStorage}
    >
      <App />
    </CrossRouterProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
