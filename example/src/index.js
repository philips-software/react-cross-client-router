import React from "react";
import ReactDOM from "react-dom";
import BroadcastChannel from 'broadcast-channel';
import { BrowserRouter } from 'react-router-dom';
import { ClientStateProvider } from 'react-cross-client-router'


import "./index.css";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <ClientStateProvider
      channel={new BroadcastChannel("react-cross-tab-router")}
      storage={window.sessionStorage}
    >
      <App />
    </ClientStateProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
