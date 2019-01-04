# react-cross-client-router

[![NPM](https://img.shields.io/npm/v/react-cross-client-router.svg)](https://www.npmjs.com/package/react-cross-client-router) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A tool to control React apps spanning multiple tabs, windows or devices.

Control the tab on your second screen by using your first screen, all without using a server.

- Run the example app to see it in action.
- Checkout the example/ folder for source code.

## Features

- Channel agnostic:
  - Uses broadcast-channel for a frontend-only implementation
  - Supports websockets to control apps spanning multiple devices.
- Uses location.history to control tabs, compatible with react-router-dom
- Keeps track of active tabs, detects when tabs quit.
- Tab IDs are persistent.

## Demo

![alt text](demo/screencast.gif "React cross client router example screencast")

## Install

```bash
yarn add broadcast-channel react-cross-client-router
```

## Quick start

```jsx
import React from 'react';
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
