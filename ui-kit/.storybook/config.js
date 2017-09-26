// @flow
import React from 'react';
// $FlowFixMe
import { configure, addDecorator } from '@storybook/react';
// $FlowFixMe
import { ThemeProvider } from 'styled-components';
import theme from '../components/theme';

function loadStories() {
  require('../stories/index.js');
}

addDecorator(story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);

configure(loadStories, module);
