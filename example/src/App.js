import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { CrossRouterProvider } from 'react-cross-client-router'

const ListView = () => (
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
  </ul>
);

const DetailView = () => (
  <div>Details for item X</div>
);

export default class App extends Component {
  render () {
    return (
      <div>
        <p>EXAMPL E </p>
        <Route path="/" exact component={ListView} />
        <Route path="/detail" component={DetailView} />
      </div>
    )
  }
}
