import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Controller from "./Router";

export const ClientControllerContext = React.createContext("clientController");

class ClientControllerProvider extends Component {
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

    this.controller = new Controller(history, channel, storage);
    this.controller.onUpdate = this.handleUpdate;

    this.state = {
      tabs: this.controller.tabs,
      router: this.controller,
    };
  }

  handleUpdate = () => {
    this.setState({ tabs: this.controller.tabs });
  }

  render() {
    const { children } = this.props;

    return (
      <ClientControllerContext.Provider value={this.state}>
        {children}
      </ClientControllerContext.Provider>
    );
  }
}

export function withClientController(TargetComponent) {
  return function ClientControllerComponent(props) {
    return (
      <ClientControllerContext.Consumer>
        {contextApi => (
          <TargetComponent {...props} clientController={contextApi} />
        )}
      </ClientControllerContext.Consumer>
    );
  };
}

export default withRouter(ClientControllerProvider);
