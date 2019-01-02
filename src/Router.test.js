import { createMemoryHistory } from 'history';
import unload from 'unload';

import Router from './ClientRouter';

class MockStorage {
  constructor() {
    this.data = {};
  }

  setItem(key, value) {
    this.data[key] = value;
  }

  getItem(key) {
    return this.data[key];
  }
}

class MockChannel {
  constructor() {
    this.messages = [];
  }

  postMessage = msg => {
    this.onmessage(msg);
    this.messages.push(msg);
  };
}

const TAB_ID = 'henk';

describe('The Router', () => {
  let channel;
  let storage;
  let history;
  let router;
  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: [
        {
          pathName: '/henk',
          search: `?tabId=${TAB_ID}&foo=bar`,
        },
      ],
    });
    channel = new MockChannel();
    storage = new MockStorage();
    router = new Router(history, channel, storage);
  });
  it('should find the tabId from the url', () => {
    expect(router.tabId).toBe(TAB_ID);
  });

  it('removes only that search param after registering', () => {
    expect(history.location.search).toBe('?foo=bar');
  });

  it('should store the tabId in localstorage', () => {
    expect(storage.getItem('react-cross-tab-router-tabId')).toEqual(TAB_ID);
  });

  it('should get the tabId from storage when its not found in the url', () => {
    history = createMemoryHistory({
      initialEntries: ['/henk'],
    });
    storage.setItem('react-cross-tab-router-tabId', 'asdf');
    router = new Router(history, channel, storage);

    expect(router.tabId).toBe('asdf');
  });

  it('should send a JOIN signal', () => {
    expect(channel.messages).toContainEqual(JSON.stringify(['JOIN', TAB_ID]));
  });

  it('when leaving should send a LEAVE signal', () => {
    unload.runAll();
    expect(channel.messages).toContainEqual(JSON.stringify(['LEAVE', TAB_ID]));
  });

  it('should add a tabId to memory when encountering a JOIN', () => {
    channel.postMessage(JSON.stringify(['JOIN', 'newTab']));
    expect(router.tabs).toContain('newTab');
  });

  it('remove a tabId from memory when encountering a LEAVE signal', () => {
    channel.postMessage(JSON.stringify(['JOIN', 'newTab']));
    channel.postMessage(JSON.stringify(['LEAVE', 'newTab']));
    expect(router.tabs).not.toContain('newTab');
  });

  it('should redirect to a page when a OPEN signal is target to this tab', () => {
    channel.postMessage(
      JSON.stringify([
        'OPEN',
        {
          targetTab: TAB_ID,
          location: '/location',
        },
      ]),
    );

    expect(history.location.pathname).toBe('/location');
  });

  it('should respond with its own tabId (ACK_JOIN) when encountering a JOIN signal', () => {
    channel.postMessage(JSON.stringify(['JOIN', 'newTab']));
    expect(channel.messages).toContainEqual(JSON.stringify(['ACK_JOIN', TAB_ID]));
  });

  it('should not ACK_JOIN its own join', () => {
    expect(channel.messages).not.toContainEqual(JSON.stringify(['ACK_JOIN', TAB_ID]));
  });

  it('should add a tabId to memory when encountering an ACK_JOIN', () => {
    channel.postMessage(JSON.stringify(['ACK_JOIN', 'earlierOpenedTab']));
    expect(router.tabs).toContain('earlierOpenedTab');
  });
});
