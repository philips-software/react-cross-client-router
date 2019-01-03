import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import ClientRouter from "./ClientRouter";

export const ClientRouterContext = React.createContext("crossClientRouter");

class ClientRouterProvider extends Component {
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

    // this.clientRouterRef = React.createRef();

    this.state = {
      tabs: [],
      tabId: null,
    }

    // const { history, channel, storage } = props;

    // this.clientRouter = new ClientRouter(history, channel, storage);
    // this.clientRouter.onUpdate = this.handleUpdate;

    // this.state = {
    //   tabs: this.clientRouter.tabs,
    //   router: this.clientRouter,
    // };
  }

  handleChange = (state) => {
    this.setState(state)
  }

  handleRef = (router) => {
    this.setState({ router });
  }

  render() {
    const { children, history, channel, storage } = this.props;

    return (
      <ClientRouterContext.Provider value={this.state}>
        <Fragment>
          <ClientRouter
            history={history}
            channel={channel}
            storage={storage}
            state={this.state}
            onChange={this.handleChange}
            ref={this.handleRef}
          />
          {children}
        </Fragment>
      </ClientRouterContext.Provider>
    );
  }
}

export function withClientRouter(TargetComponent) {
  return function ClientRouterComponent(props) {
    return (
      <ClientRouterContext.Consumer>
        {contextApi => (
          <TargetComponent {...props} clientRouter={contextApi} />
        )}
      </ClientRouterContext.Consumer>
    );
  };
}

export default withRouter(ClientRouterProvider);
