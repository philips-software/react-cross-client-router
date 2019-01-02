import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ClientStateContext } from './ClientStateProvider';

class ClientLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    clientState: PropTypes.shape({
      tabs: PropTypes.array.isRequired,
    }).isRequired,
    targetTab: PropTypes.string,
  };

  static defaultProps = {
    targetTab: 'child',
  };

  static contextType = ClientStateContext;

  handleClick = e => {
    const { targetTab, to } = this.props;
    const { router } = this.context;

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

export default ClientLink;


