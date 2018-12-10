import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import { withClientController, CrossLink } from 'react-cross-client-router'

const ListView = () => (
  <ul>

  <li><CrossLink to="/detail/1">Item 1</CrossLink></li>
  <li><CrossLink to="/detail/2">Item 2</CrossLink></li>
  <li><CrossLink to="/detail/3">Item 3</CrossLink></li>
  <li><CrossLink to="/detail/4">Item 4</CrossLink></li>
  </ul>
);

const DetailView = ({ match }) => (
  <div>Details for item {match.params.id}</div>
);

class App extends Component {
  render () {
    const { clientController } = this.props;
    console.log('tabs', clientController.tabs);
    return (
      <div>
        <p>{clientController.tabId}</p>
        <ul>
          {clientController.tabs.map(tab => (
            <li key={tab}>{tab}</li>
          ))}
        </ul>
        <Route path="/" exact component={ListView} />
        <Route path="/detail/:id" component={DetailView} />
      </div>
    )
  }
}

export default withClientController(App);
