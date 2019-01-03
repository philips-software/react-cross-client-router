import React from 'react';
import ReactDOM from 'react-dom';
import BroadcastChannel from 'broadcast-channel';
import { BrowserRouter } from 'react-router-dom';
import { ClientRouterProvider } from 'react-cross-client-router'


import './index.css';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <ClientRouterProvider
      channel={new BroadcastChannel('react-cross-tab-router')}
      storage={window.sessionStorage}
    >
      <App />
    </ClientRouterProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
