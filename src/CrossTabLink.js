import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { router } from './Router';


export default class CrossTabLink extends Component {
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


