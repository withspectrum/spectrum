// handle initial auth and determine what components to load

import Homepage from './containers/homepage';
import Routes from './routes';

// figure out if the user is authenticated

function decideWhatToDo() {
  if (!user) {
    return Homepage;
  } else {
    return Routes;
  }

  return Loading;
}
