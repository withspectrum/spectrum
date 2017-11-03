// @flow
import React from 'react';
import { storiesOf, setAddon } from '@storybook/react';
// $FlowIssue
import { action } from '@storybook/addon-actions';
import { withKnobs, number, text } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';
import HeadingTwo from '../../../ui-kit/components/headingTwo';

setAddon(JSXAddon);

const stories = storiesOf('Type', module);
stories.addDecorator(withKnobs);

stories.addWithJSX('Headings Two', () => (
  <HeadingTwo>{text('Text', 'Heading')}</HeadingTwo>
));
