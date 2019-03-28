// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import createLinksDecorator, {
  type LinksDecoratorComponentProps,
} from './core';
import { SPECTRUM_URLS } from 'shared/regexps';

export default createLinksDecorator((props: LinksDecoratorComponentProps) => {
  const regexp = new RegExp(SPECTRUM_URLS, 'ig');
  const match = regexp.exec(props.href);

  if (match && match[0] && match[1])
    return <Link to={match[1]}>{props.children}</Link>;

  return (
    <a href={props.href} target={'_blank'} rel={'noopener noreferrer'}>
      {props.children}
    </a>
  );
});
