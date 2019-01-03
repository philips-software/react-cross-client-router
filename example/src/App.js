import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import { ClientRouterContext, ClientLink } from "react-cross-client-router";

const GalleryItem = ({ id }) => (
  <ClientLink targetTab="detail" to={`/detail/${id}`}>
    <img
      href={`Placeholder with id=${id}`}
      src={`https://picsum.photos/300/300?image=${id}`}
    />
  </ClientLink>
);

// Not all placeholders work...
const IDs = [
  200,
  201,
  202,
  203,
  204,
  206,
  208,
  209,
  210,
  211,
  212,
  213,
  214,
  215,
  216,
  217,
  218,
  219,
  220,
  221,
  222,
  223,
  225,
  227,
  228,
  229,
  230
];

const Gallery = ({ location }) => {
  const offset = 0;
  const imageIds = IDs.slice(offset, offset + 9);
  return (
    <div className="gallery">
      <h2>Click on an image to open a detailed view in a new tab</h2>
      {imageIds.map(id => (
        <GalleryItem id={id} key={id} />
      ))}
    </div>
  );
};

const DetailView = ({ match }) => {
  const id = match.params.id || 1062;
  return (
    <div>
      <p>Details for item {match.params.id}</p>
      <img
        href={`Detail image with id=${id}`}
        src={`https://picsum.photos/650/650?image=${id}`}
      />
    </div>
  );
};

class App extends Component {
  static contextType = ClientRouterContext;
  render() {
    const clientRouter = this.context;
    return (
      <div>
        <h1>react-cross-client-router example</h1>
        <div>
          <p>Tab name: {clientRouter.tabId}</p>
          <p>Connected tabs: {clientRouter.tabs.join(", ")}</p>
        </div>
        <Route path="/" exact component={Gallery} />
        <Route path="/detail/:id" component={DetailView} />
      </div>
    );
  }
}

export default App;
