import unload from 'unload';
import * as constants from './constants';

const URL_PARAM = 'tabId';
const LOCAL_STORAGE_KEY = 'react-cross-tab-router-tabId';

export default class ClientRouter {
  constructor({ history, channel, storage, basename, onChange }) {
    this.state = {
      tabId: null,
      tabs: [],
    };

    this.basename = basename;
    this.history = history;
    this.channel = channel;
    this.storage = storage;
    this.onChange = onChange;
    this.channel.onmessage = this.handleMessage.bind(this);

    this.register();
    unload.add(this.unregister.bind(this));
  }

  setChangeListener(changeListener) {
    this.onChange = changeListener;
  }

  handleMessage(rawMessage) {
    let message;
    try {
      message = JSON.parse(rawMessage);
    } catch (e) {
      message = rawMessage;
    }

    const { tabs, tabId } = this.state;
    const [type, body] = message;

    switch (type) {
      case constants.PROTO_JOIN: {
        const newRoomName = body;
        if (!tabs.includes(newRoomName)) {
          this.set({
            tabs: [...tabs, newRoomName],
          });
        }

        if (newRoomName !== tabId) {
          this.acknowledgeJoin();
        }
        break;
      }
      case constants.PROTO_ACK_JOIN: {
        const newRoomName = body;
        if (!tabs.includes(newRoomName)) {
          this.set({
            tabs: [...tabs, newRoomName],
          });
        }
        break;
      }

      case constants.PROTO_LEAVE: {
        const targetRoomName = body;

        this.set({
          tabs: tabs.filter(tab => tab !== targetRoomName),
        });

        break;
      }

      case constants.PROTO_OPEN:
        if (body.targetTab !== tabId) {
          break;
        }
        this.history.push(body.location);
        break;

      default: {
        console.error('Unknown message type', type); /* eslint-disable-line */
      }
    }
  }

  set = newState => {
    this.state = { ...this.state, ...newState };
    if (this.onChange) {
      this.onChange(this.state);
    }
  };

  acknowledgeJoin() {
    this.sendMessage([constants.PROTO_ACK_JOIN, this.state.tabId]);
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
      tabId = this.storage.getItem(LOCAL_STORAGE_KEY) || constants.PARENT_NAME;
    }

    this.set({
      tabId,
      tabs: [...this.state.tabs, tabId],
    });

    this.storage.setItem(LOCAL_STORAGE_KEY, tabId);
    this.sendMessage([constants.PROTO_JOIN, tabId]);
  }

  unregister() {
    this.sendMessage([constants.PROTO_LEAVE, this.state.tabId]);
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
