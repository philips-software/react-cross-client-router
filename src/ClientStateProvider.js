import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import ClientRouter from "./ClientRouter";

export const ClientStateContext = React.createContext("crossClientState");

class ClientStateProvider extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      location: PropTypes.shape({}).isRequired
    }).isRequired,
    storage: PropTypes.shape({}).isRequired,
    channel: PropTypes.shape({
      postMessage: PropTypes.func.isRequired
    }).isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const { history, channel, storage } = props;

    this.clientRouter = new ClientRouter(history, channel, storage);
    this.clientRouter.onUpdate = this.handleUpdate;

    this.state = {
      tabs: this.clientRouter.tabs,
      router: this.clientRouter,
    };
  }

  handleUpdate = () => {
    this.setState({ tabs: this.clientRouter.tabs });
  }

  render() {
    const { children } = this.props;

    return (
      <ClientStateContext.Provider value={this.state}>
        {children}
      </ClientStateContext.Provider>
    );
  }
}

export function withClientState(TargetComponent) {
  return function ClientStateComponent(props) {
    return (
      <ClientStateContext.Consumer>
        {contextApi => (
          <TargetComponent {...props} clientState={contextApi} />
        )}
      </ClientStateContext.Consumer>
    );
  };
}

export default withRouter(ClientStateProvider);
