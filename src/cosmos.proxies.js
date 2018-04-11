// @flow

import React from 'react';
import createReduxProxy from 'react-cosmos-redux-proxy';
import { ThemeProvider } from 'styled-components';
import { initStore } from './store';
import { theme } from './components/theme';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

const ReduxProxy = createReduxProxy({
  createStore: initStore,
});

const ThemeProviderProxy = (props: ProxyProps) => {
  const { nextProxy, ...rest } = props;
  const { value: NextProxy, next } = nextProxy;

  return (
    <ThemeProvider theme={theme}>
      <NextProxy {...rest} nextProxy={next()} />
    </ThemeProvider>
  );
};

export default [ReduxProxy, ThemeProviderProxy];
