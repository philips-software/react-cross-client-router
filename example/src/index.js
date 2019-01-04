import React from 'react';
import ReactDOM from 'react-dom';
import BroadcastChannel from 'broadcast-channel';
import { BrowserRouter } from 'react-router-dom';
import { ClientRouterProvider } from 'react-cross-client-router'

import './index.css';
import App from './App';

let relativePath = '';
if (process.env.PUBLIC_URL) {
  const publicUrl = new URL(process.env.PUBLIC_URL);
  relativePath = publicUrl.pathname;
}

ReactDOM.render(
  <BrowserRouter basename={relativePath}>
    <ClientRouterProvider
      channel={new BroadcastChannel('react-cross-tab-router')}
      storage={window.sessionStorage}
      basename={relativePath}
    >
      <App />
    </ClientRouterProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
