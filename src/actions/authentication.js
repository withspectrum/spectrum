// @flow
import { track, set } from '../helpers/events';
import { removeItemFromStorage, storeItem } from '../helpers/localStorage';
import Raven from 'raven-js';

export const logout = () => {
  track(`user`, `sign out`, null);
  // clear localStorage
  removeItemFromStorage('spectrum');
  import('../api')
    .then(module => module.clearApolloStore)
    .then(clearApolloStore => {
      // clear Apollo's query cache
      clearApolloStore();
      // redirect to home page
      window.location.href =
        process.env.NODE_ENV === 'production'
          ? '/auth/logout'
          : 'http://localhost:3001/auth/logout';
    });
};

export const saveUserDataToLocalStorage = (user: Object) => dispatch => {
  const obj = {};

  if (!user) {
    logout();
  }
  // construct a clean object that doesn't include any metadata from apollo
  // like __typename
  obj['currentUser'] = {
    id: user.id,
    name: user.name,
    username: user.username,
    profilePhoto: user.profilePhoto,
    coverPhoto: user.coverPhoto,
    website: user.website,
  };

  // logs the user id to sentry errors
  Raven.setUserContext({ id: user.id });

  // set user id context in google analytics
  set(user.id);

  // save this object to localstorage. This will be used in the future to hydrate
  // the store when users visit the homepage
  storeItem('spectrum', obj);

  // dispatch to the store and save the user
  dispatch({
    type: 'SET_USER',
    user,
  });
};
