import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import unload from 'unload';

const MASTER_NAME = 'parent';
const PROTO_JOIN = 'JOIN';
const PROTO_ACK_JOIN = 'ACK_JOIN';
const PROTO_LEAVE = 'LEAVE';
const PROTO_OPEN = 'OPEN';

const URL_PARAM = 'tabId';
const LOCAL_STORAGE_KEY = 'react-cross-tab-router-tabId';

export class Router {
  constructor() {
    this.initialized = false;
    this.tabs = [];
  }

  init(history, channel, storage) {
    this.history = history;
    this.channel = channel;
    this.storage = storage;
    this.channel.onmessage = this.handleMessage.bind(this);

    this.register();
    unload.add(this.unregister.bind(this));
    this.initialized = true;
  }

  handleMessage(rawMessage) {
    let message;
    try {
      message = JSON.parse(rawMessage);
    } catch (e) {
      message = rawMessage;
    }

    const [type, body] = message;

    switch (type) {
      case PROTO_JOIN: {
        const newRoomName = body;
        if (!this.tabs.includes(newRoomName)) {
          this.tabs.push(newRoomName);
        }

        if (newRoomName !== this.tabId) {
          this.acknowledgeJoin();
        }
        break;
      }
      case PROTO_ACK_JOIN: {
        const newRoomName = body;
        if (!this.tabs.includes(newRoomName)) {
          this.tabs.push(newRoomName);
        }
        break;
      }

      case PROTO_LEAVE: {
        const targetRoomName = body;
        const tabIndex = this.tabs.indexOf(targetRoomName);
        this.tabs.splice(tabIndex, 1);
        break;
      }

      case PROTO_OPEN:
        if (body.targetTab !== this.tabId) {
          break;
        }
        this.history.push(body.location);
        break;

      default: {
        console.error('Unknown message type', type); /* eslint-disable-line */
      }
    }
  }

  acknowledgeJoin() {
    this.sendMessage([PROTO_ACK_JOIN, this.tabId]);
  }

  register() {
    // Find out what the name of this tab is
    const { location } = this.history;
    const searchParams = new URLSearchParams(location.search);
    let tabId = searchParams.get(URL_PARAM);

    if (tabId) {
      searchParams.delete(URL_PARAM);

      // A bit nasty that we have to compile the url on our own
      // If we push to url.href, it will will append the full url as relative path.
      this.history.push(`${location.pathname}?${searchParams}`);
    } else {
      tabId = this.storage.getItem(LOCAL_STORAGE_KEY) || MASTER_NAME;
    }

    this.tabId = tabId;
    this.tabs.push(tabId);

    this.storage.setItem(LOCAL_STORAGE_KEY, tabId);
    this.sendMessage([PROTO_JOIN, tabId]);
  }

  unregister() {
    this.sendMessage([PROTO_LEAVE, this.tabId]);
  }

  sendMessage(message) {
    if (typeof message !== 'object') {
      throw new Error('Only JSON can be sent over the broadcast channel');
    }
    this.channel.postMessage(JSON.stringify(message));
  }

  redirectTargetTab(targetTab, location) {
    this.sendMessage([
      PROTO_OPEN,
      {
        targetTab,
        location,
      },
    ]);
  }
}

export const router = new Router();

const CrossTabRouter = ({ history, channel, storage }) => {
  if (!router.initialized) {
    router.init(history, channel, storage);
  }

  return null;
};

export class CrossTabLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    targetTab: PropTypes.string,
  };

  static defaultProps = {
    targetTab: 'child',
  };

  handleClick = e => {
    const { targetTab, to } = this.props;

    if (!router.tabs.includes(targetTab)) {
      return;
    }

    // if that target already exists, don't open a new tab
    e.preventDefault();

    if (targetTab === router.tabId) {
      router.history.push(to);
      return;
    }

    router.redirectTargetTab(targetTab, to);
  };

  render() {
    const { children, to, targetTab } = this.props;

    const scopedHref = `${to}?tabId=${targetTab}`;
    return (
      <a href={scopedHref} target="_blank" rel="noopener noreferrer" onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

CrossTabRouter.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default withRouter(CrossTabRouter);
