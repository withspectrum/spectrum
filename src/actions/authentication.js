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

export const saveUserDataToLocalStorage = (user: Object) => {
  const obj = {};

  obj['user'] = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    username: user.username,
    photoURL: user.photoURL,
  };

  storeItem('spectrum', obj);
};
