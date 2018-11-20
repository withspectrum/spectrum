import { setUser, unsetUser } from 'src/helpers/analytics';
import { removeItemFromStorage, storeItem } from 'src/helpers/localStorage';

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
  obj['currentUser'] = user;

  // logs user id to analytics
  const response = await fetch(
    `https://micro-anonymizomatic-woewfxwpkp.now.sh?text=${user.id}`
  );
  const { text } = await response.json();
  setUser(text);

  // logs the user id to Sentry
  // if Raven hasn't loaded yet, try every 5s until it's loaded
  if (window.Raven) {
    console.log('Raven setUserContext!');
    window.Raven.setUserContext({ id: user.id });
  } else {
    console.log('No Raven :( Try again in 5s');
    const interval = setInterval(() => {
      console.log('Raven?');
      if (window.Raven) {
        console.log('Yes! setUserContext');
        window.Raven.setUserContext({ id: user.id });
        clearInterval(interval);
      }
      console.log('No :( Try again in 5s');
    }, 5000);
  }

  // save this object to localstorage. This will be used in the future to hydrate
  // the store when users visit the homepage
  storeItem('spectrum', obj);

  // dispatch to the store and save the user
  dispatch({
    type: 'SET_USER',
    user,
  });
};
