// @flow
import React from 'react';
import createLinksDecorator, {
  type LinksDecoratorComponentProps,
} from './core';
import Anchor from '../../../../mobile/components/Anchor';

export default createLinksDecorator((props: LinksDecoratorComponentProps) => (
  <Anchor href={props.href}>{props.children}</Anchor>
));
