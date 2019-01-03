import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import {
  ClientRouterContext,
  ClientLink,
  withClientRouter
} from "react-cross-client-router";

const GalleryItem = ({ id }) => (
  <ClientLink targetTab="detail" to={`/detail/${id}`}>
    <img
      href={`Placeholder with id=${id}`}
      src={`https://picsum.photos/250/250?image=${id}`}
    />
  </ClientLink>
);

// Not all placeholders work...
const IDs = [
  200, 201, 202, 203, 204, 206, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 225, 227, 228, 229, 230
];

const Gallery = withClientRouter(({ clientRouter }) => {
  const offset = 0;
  const imageIds = IDs.slice(offset, offset + 9);
  return (
    <div>
      {clientRouter.tabs.includes("detail") ? (
        <h2>
          The detail view tab exists, click an image to route the detail view
          tab to the new image
        </h2>
      ) : (
        <h2>Click on an image to open a detailed view in a new tab</h2>
      )}
      <div className="gallery">
        {imageIds.map(id => (
          <GalleryItem id={id} key={id} />
        ))}
      </div>
    </div>
  );
});

const DetailView = withClientRouter(({ match, clientRouter }) => {
  const id = match.params.id || 1062;
  return (
    <div>
      {!clientRouter.tabs.includes("parent") && (
        <ClientLink targetTab="parent" to="/">
          <h2>The parent tab seems to be closed, click here to reopen it.</h2>
        </ClientLink>
      )}
      <img
        href={`Detail image with id=${id}`}
        src={`https://picsum.photos/650/650?image=${id}`}
      />
    </div>
  );
});

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
