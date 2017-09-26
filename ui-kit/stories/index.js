// @flow
import React from 'react';
// $FlowFixMe
import { storiesOf, setAddon } from '@storybook/react';
// $FlowFixMe
import { action } from '@storybook/addon-actions';
// $FlowFixMe
import { withKnobs, number, text } from '@storybook/addon-knobs';
// $FlowFixMe
import JSXAddon from 'storybook-addon-jsx';
import Heading from '../components/text';

setAddon(JSXAddon);

const stories = storiesOf('Type', module);
stories.addDecorator(withKnobs);
const textOptions = {
  range: true,
  min: 1,
  max: 6,
  step: 1,
};

stories.addWithJSX('Headings', () => (
  <Heading
    size={number('Size', 1, textOptions)}
    weight={number('Weight', 3, textOptions)}
  >
    {text('Text', 'Heading')}
  </Heading>
));
