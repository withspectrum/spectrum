// @flow
import { combineReducers } from 'redux';
import modals from './modals';
import toasts from './toasts';
import gallery from './gallery';
import threadSlider from './threadSlider';
import connectionStatus from './connectionStatus';
import titlebar from './titlebar';

const getReducers = () => {
  return combineReducers({
    modals,
    toasts,
    gallery,
    threadSlider,
    connectionStatus,
    titlebar,
  });
};

export default getReducers;
