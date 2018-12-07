import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { router } from './Router';

const CrossTabRouter = ({ history, channel, storage }) => {
  if (!router.initialized) {
    router.init(history, channel, storage);
  }

  return null;
};

CrossTabRouter.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default withRouter(CrossTabRouter);
