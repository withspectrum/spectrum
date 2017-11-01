// @flow
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import theme from '../ui-kit/theme';

function loadStories() {
  require('./components');
}

addDecorator(story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);
configure(loadStories, module);
