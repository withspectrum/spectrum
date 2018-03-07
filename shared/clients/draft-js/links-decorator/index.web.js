// @flow
import React from 'react';
import createLinksDecorator, {
  type LinksDecoratorComponentProps,
} from './core';

export default createLinksDecorator((props: LinksDecoratorComponentProps) => (
  <a href={props.href} target="_blank" rel="noopener nofollower">
    {props.children}
  </a>
));
