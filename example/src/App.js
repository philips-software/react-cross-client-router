import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import { ClientRouterContext, ClientLink } from 'react-cross-client-router'

const ListView = () => (
  <ul>

  <li><ClientLink to="/detail/1">Item 1</ClientLink></li>
  <li><ClientLink to="/detail/2">Item 2</ClientLink></li>
  <li><ClientLink to="/detail/3">Item 3</ClientLink></li>
  <li><ClientLink to="/detail/4" targetTab="child-2">Item 4 in child2</ClientLink></li>
  </ul>
);

const DetailView = ({ match }) => (
  <div>Details for item {match.params.id}</div>
);

class App extends Component {
  static contextType = ClientRouterContext;
  render () {
    const clientRouter = this.context;
    return (
      <div>
        <p>{clientRouter.tabId}</p>
        <ul>
          {clientRouter.tabs.map(tab => (
            <li key={tab}>{tab}</li>
          ))}
        </ul>
        <Route path="/" exact component={ListView} />
        <Route path="/detail/:id" component={DetailView} />
      </div>
    )
  }
}

export default App;
