import { clearApolloStore } from '../api';
import { removeItemFromStorage, storeItem } from '../helpers/localStorage';

export const logout = () => {
  // clear localStorage
  removeItemFromStorage('spectrum');
  // clear Apollo's query cache
  clearApolloStore();
  // redirect to home page
  window.location.href = '/';
};

export const saveUserDataToLocalStorage = (user: Object) => dispatch => {
  const obj = {};
  // construct a clean object that doesn't include any metadata from apollo
  // like __typename
  obj['currentUser'] = {
    uid: user.uid,
    displayName: user.displayName,
    username: user.username,
    photoURL: user.photoURL,
  };

  // save this object to localstorage. This will be used in the future to hydrate
  // the store when users visit the homepage
  storeItem('spectrum', obj);

  // dispatch to the store and save the user
  dispatch({
    type: 'SET_USER',
    user,
  });
};
