import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withClientController } from './RouterProvider';

class CrossTabLink extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    controller: PropTypes.shape({
      tabs: PropTypes.array.isRequired,
    }).isRequired,
    targetTab: PropTypes.string,
  };

  static defaultProps = {
    targetTab: 'child',
  };

  handleClick = e => {
    const { targetTab, to, controller } = this.props;

    if (!controller.tabs.includes(targetTab)) {
      return;
    }

    // if that target already exists, don't open a new tab
    e.preventDefault();

    if (targetTab === controller.tabId) {
      controller.history.push(to);
      return;
    }

    controller.redirectTargetTab(targetTab, to);
  };

  render() {
    const { children, to, targetTab } = this.props;

    const scopedHref = `${to}?tabId=${targetTab}`;
    return (
      <a href={scopedHref} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export default withClientController(CrossTabLink);


