import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ClientRouterContext } from './ClientRouterProvider';
import * as constants from './constants';

class ClientLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    targetTab: PropTypes.string,
  };

  static defaultProps = {
    targetTab: constants.CHILD_NAME,
  };

  handleClick = e => {
    const { targetTab, to } = this.props;
    const { tabs, tabId, router } = this.context;

    if (!tabs.includes(targetTab)) {
      return;
    }

    // if that target already exists, don't open a new tab
    e.preventDefault();

    if (targetTab === tabId) {
      router.history.push(to);
      return;
    }

    router.redirectTargetTab(targetTab, to);
  };

  static contextType = ClientRouterContext;

  render() {
    const { children, to, targetTab } = this.props;
    const { router } = this.context;

    let scopedHref = `${to}?tabId=${targetTab}`;

    if (router.basename) {
      scopedHref = `${router.basename}${scopedHref}`;
    }

    return (
      <a
        href={scopedHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={this.handleClick}
      >
        {children}
      </a>
    );
  }
}

export default ClientLink;
