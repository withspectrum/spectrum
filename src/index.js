// @flow
import React from 'react';
import ReactDOM from 'react-dom';
//$FlowFixMe
import { Provider } from 'react-redux';
//$FlowFixMe
import { ThemeProvider } from 'styled-components';
import { initStore } from './store';
import { clearStorage, getItemFromStorage } from './helpers/localStorage';
import { theme } from './containers/ui/components/theme';
import Routes from './routes';
import Homepage from './containers/homepage';

const initialState = getItemFromStorage('spectrum');
const store = initStore(initialState || {});

function render() {
  // if user is not stored in localStorage and they visit a blacklist url
  if (
    !initialState &&
    (window.location.pathname === '/' ||
      window.location.pathname === '/messages' ||
      window.location.pathname === '/notifications')
  ) {
    return ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Homepage />
      </ThemeProvider>,
      document.querySelector('#root')
    );
  }

  // otherwise load the app and we'll handle logged-out and logged-in users
  // further down the tree
  return ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </Provider>,
    document.querySelector('#root')
  );
}

try {
  render();
} catch (err) {
  clearStorage();
  render();
}
