import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Controller from './Router';

const ClientControllerContext = React.createContext('clientController');

class ClientControllerProvider extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      location: PropTypes.shape({}).isRequired,
    }).isRequired,
    storage: PropTypes.shape({

    }).isRequired,
    channel: PropTypes.shape({
      postMessage: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    const { history, channel, storage } = props;

    this.controller = new Controller(history, channel, storage);
  }

  render() {
    const { children } = this.props;

    return <ClientControllerContext.Provider value={this.controller}>{children}</ClientControllerContext.Provider>;
  }
}

export function withClientController(TargetComponent) {
  return function ClientControllerComponent(props) {
    return (
      <ClientControllerContext.Consumer>
        {contextApi => <TargetComponent {...props} clientController={contextApi} />}
      </ClientControllerContext.Consumer>
    );
  };
}

export default withRouter(ClientControllerProvider);
