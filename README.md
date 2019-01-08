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

It is recommended to make the ClientRouterProvider a child of the react-router-dom BrowserRouter.

```jsx
import React from 'react';
import BroadcastChannel from 'broadcast-channel';
import { ClientRouterProvider, ClientLink } from 'react-cross-client-router'

export default () => (
  <ClientRouterProvider
    channel={new BroadcastChannel('react-cross-tab-router')}
    storage={window.sessionStorage}
  >
    <ClientLink targetTab="parent" to="/foo">
      Link parent tab to /foo
    </ClientLink>
    <ClientLink targetTab="parent" to="/bar">
      Link parent tab to /foo
    </ClientLink>
    <ClientLink targetTab="child" to="/foo">
      Link child tab to /foo
    </ClientLink>
    <ClientLink targetTab="child" to="/bar">
      Link child tab to /foo
    </ClientLink>
  </ClientRouterProvider>
)
```
