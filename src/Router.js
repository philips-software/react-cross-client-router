import unload from 'unload';
import * as constants from './constants';

const URL_PARAM = 'tabId';
const LOCAL_STORAGE_KEY = 'react-cross-tab-router-tabId';

export default class Router {
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
      case constants.PROTO_JOIN: {
        const newRoomName = body;
        if (!this.tabs.includes(newRoomName)) {
          this.tabs.push(newRoomName);
        }

        if (newRoomName !== this.tabId) {
          this.acknowledgeJoin();
        }
        break;
      }
      case constants.PROTO_ACK_JOIN: {
        const newRoomName = body;
        if (!this.tabs.includes(newRoomName)) {
          this.tabs.push(newRoomName);
        }
        break;
      }

      case constants.PROTO_LEAVE: {
        const targetRoomName = body;
        const tabIndex = this.tabs.indexOf(targetRoomName);
        this.tabs.splice(tabIndex, 1);
        break;
      }

      case constants.PROTO_OPEN:
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
    this.sendMessage([constants.PROTO_ACK_JOIN, this.tabId]);
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
      tabId = this.storage.getItem(LOCAL_STORAGE_KEY) || constants.MASTER_NAME;
    }

    this.tabId = tabId;
    this.tabs.push(tabId);

    this.storage.setItem(LOCAL_STORAGE_KEY, tabId);
    this.sendMessage([constants.PROTO_JOIN, tabId]);
  }

  unregister() {
    this.sendMessage([constants.PROTO_LEAVE, this.tabId]);
  }

  sendMessage(message) {
    if (typeof message !== 'object') {
      throw new Error('Only JSON can be sent over the broadcast channel');
    }
    this.channel.postMessage(JSON.stringify(message));
  }

  redirectTargetTab(targetTab, location) {
    this.sendMessage([
      constants.PROTO_OPEN,
      {
        targetTab,
        location,
      },
    ]);
  }
}

export const router = new Router();

