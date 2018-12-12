import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withClientController, ClientControllerContext } from './RouterProvider';

class CrossTabLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    clientController: PropTypes.shape({
      tabs: PropTypes.array.isRequired,
    }).isRequired,
    targetTab: PropTypes.string,
  };

  static defaultProps = {
    targetTab: 'child',
  };

  static contextType = ClientControllerContext;

  handleClick = e => {
    const { targetTab, to } = this.props;
    const clientController = this.context;

    if (!clientController.tabs.includes(targetTab)) {
      return;
    }

    // if that target already exists, don't open a new tab
    e.preventDefault();

    if (targetTab === clientController.tabId) {
      clientController.history.push(to);
      return;
    }

    clientController.redirectTargetTab(targetTab, to);
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

export default CrossTabLink;


