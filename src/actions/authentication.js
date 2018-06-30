import { setUser, unsetUser } from 'src/helpers/analytics';
import { removeItemFromStorage, storeItem } from 'src/helpers/localStorage';
import Raven from 'raven-js';

export const logout = dispatch => {
  // clear localStorage
  removeItemFromStorage('spectrum');

  // no longer track analytics
  unsetUser();

  import('shared/graphql')
    .then(module => module.clearApolloStore)
    .then(clearApolloStore => {
      // clear Apollo's query cache
      clearApolloStore();
      // redirect to home page
      window.location.href =
        process.env.NODE_ENV === 'production'
          ? '/auth/logout'
          : 'http://localhost:3001/auth/logout';
      dispatch({
        type: 'CLEAR_USER',
      });
    });
};

export const saveUserDataToLocalStorage = (user: Object) => async dispatch => {
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
    totalReputation: user.totalReputation,
  };

  // logs user id to analytics
  const response = await fetch(
    `https://micro-anonymizomatic-woewfxwpkp.now.sh?text=${user.id}`
  );
  const { text } = await response.json();
  setUser(text);

  // logs the user id to sentry errors
  Raven.setUserContext({ id: user.id });

  // save this object to localstorage. This will be used in the future to hydrate
  // the store when users visit the homepage
  storeItem('spectrum', obj);

  // dispatch to the store and save the user
  dispatch({
    type: 'SET_USER',
    user,
  });
};
