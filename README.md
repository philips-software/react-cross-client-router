# react-cross-client-router

[![NPM](https://img.shields.io/npm/v/react-cross-client-router.svg)](https://www.npmjs.com/package/react-cross-client-router)
[![Build Status](https://travis-ci.com/philips-software/react-cross-client-router.svg?branch=master)](https://travis-ci.com/philips-software/react-cross-client-router)

A tool to control React apps spanning multiple tabs, windows or devices.

Control the tab on your second screen by using your first screen, all without using a server.

- Run the example app to see it in action.
- Checkout the example/ folder for source code.

## Features

- Channel agnostic:
  - Uses broadcast-channel for a frontend-only implementation
  - Supports websockets to control apps spanning multiple devices.
- Uses the url to control tabs, dependent on react-router-dom
- Keeps track of active tabs, detects when tabs quit.
- Tab IDs are persistent.

## Demo

![React cross client router example screencast](https://raw.githubusercontent.com/philips-software/react-cross-client-router/master/demo/screencast.gif)

## Install

```bash
yarn add broadcast-channel react-cross-client-router
```

## Quick start

The example below shows one parent (or master) page that includes links to two child (or detail) pages.
When you click on one of the links, a new tab will be opened that renders the detail view. If you move
the child to a separate browser (so that you can see both views at the same time), you can conveniently
change the content of the detail view by simply clicking on any of the two links in the master view.
You can even close the master view and the currently open detail view will be notified, providing you with a
convenience link to reopen the master view in the new tab.


### Application entry point

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import BroadcastChannel from 'broadcast-channel'
import { BrowserRouter } from 'react-router-dom'
import { ClientRouterProvider, ClientRouterContext } from 'react-cross-client-router'

import { App } from './App'

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
```

### App

```jsx
import React, { Component } from 'react';
import {
  ClientRouterContext
} from 'react-cross-client-router'

import { Master } from './Master'
import { Detail } from './Detail'

class App extends Component {
  static contextType = ClientRouterContext;
  render() {
    const clientRouter = this.context;
    return (
      <div>
        <h1>react-cross-client-router example</h1>
        <div>
          <p>Tab name: {clientRouter.tabId}</p>
          <p>Connected tabs: {clientRouter.tabs.join(", ")}</p>
        </div>
        <Route path="/" exact component={Master} />
        <Route path="/detail/:id" component={Detail} />
      </div>
    );
  }
}
```

### Master

```jsx
import React, { Component } from 'react';
import {
  withClientRouter,
  ClientLink
} from 'react-cross-client-router'

const Master = withClientRouter(({ clientRouter }) => {
  return (
    <div>
      {clientRouter.tabs.includes("detail") ? (
        <h2>
          The detail view tab exists, click an detail link to update
          the content of the detail view...
        </h2>
      ) : (
        <h2>Click one of the links below to open the corresponding detail view in the new tab</h2>
      )}
      <ClientLink targetTab="detail" to={`/detail/1`}>
        Detail View 1
      </ClientLink>
      <ClientLink targetTab="detail" to={`/detail/2`}>
        Detail View 2
      </ClientLink>
    </div>
  )
})

export { Master }
```

### Detail

```jsx
import React, { Component } from 'react';
import {
  withClientRouter,
  ClientLink
} from 'react-cross-client-router'

const Detail = withClientRouter(({ match, clientRouter }) => {
  const id = match.params.id
  return (
    <div>
      {!clientRouter.tabs.includes("parent") && (
        <ClientLink targetTab="parent" to="/">
          <h2>The parent tab seems to be closed, click here to reopen it.</h2>
        </ClientLink>
      )}
      {`Detail with id=${id}`}
    </div>
  )
})

export { Detail }
```
